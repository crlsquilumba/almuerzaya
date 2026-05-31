import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Spinner } from '@components/ui/Spinner';
import menuItemService from '@services/menuItem.service';
import { MenuItem } from '../types/entities.types';

const categoryLabels: Record<string, string> = {
  'Sopa': '🥣 Sopa',
  'Segundo': '🍖 Fuerte',
  'Bebida': '🥤 Bebida',
  'Entrada': '🥗 Entrada',
  'Postre': '🍰 Postre',
  'Extras': '🧂 Extras',
};

export const MenuManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    category: 'Segundo',
    available: true,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      if (!user?.restaurantId) {
        console.error('❌ [MENU] No restaurant ID available');
        setIsLoading(false);
        return;
      }

      try {
        console.log('📋 [MENU] Fetching menu items for restaurant:', user.restaurantId);
        setIsLoading(true);
        const data = await menuItemService.getByRestaurant(user.restaurantId);
        setMenuItems(data);
      } catch (error) {
        console.error('❌ [MENU] Error fetching menu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [user?.restaurantId]);

  const handleAddItem = async () => {
    if (!user?.restaurantId) {
      console.error('❌ [MENU] No restaurant ID available');
      return;
    }

    if (!newItem.name || !newItem.price || !newItem.description) {
      console.warn('⚠️ [MENU] Missing required fields');
      return;
    }

    try {
      console.log('➕ [MENU] Adding new item:', newItem);
      const itemToCreate = {
        ...newItem,
        restaurantId: user.restaurantId,
      };
      const createdItem = await menuItemService.create(itemToCreate);

      if (createdItem) {
        setMenuItems([...menuItems, createdItem]);
        setNewItem({
          category: 'Segundo',
          available: true,
        });
        console.log('✅ [MENU] Item added successfully');
      }
    } catch (error) {
      console.error('❌ [MENU] Error adding item:', error);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const item = menuItems.find((item) => item.id === id);
      if (!item) return;

      console.log(`🔄 [MENU] Toggling availability for item ${id} to ${!item.available}`);
      const updatedItem = await menuItemService.toggleAvailability(id, !item.available);

      if (updatedItem) {
        setMenuItems(
          menuItems.map((item) =>
            item.id === id ? { ...item, available: updatedItem.available } : item
          )
        );
        console.log('✅ [MENU] Availability toggled successfully');
      }
    } catch (error) {
      console.error('❌ [MENU] Error toggling availability:', error);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-accent-800 mb-2">
            📋 Gestión de Menú
          </h1>
          <p className="text-accent-600">Agrega y actualiza tus platos diarios</p>
        </div>

        {/* Add New Item Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-accent-800 mb-4">
            Agregar Nuevo Plato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Nombre"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Ej: Picaña con aguacate"
            />
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">
                Categoría
              </label>
              <select
                value={newItem.category || 'main'}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value as MenuItem['category'],
                  })
                }
                className="w-full px-4 py-2 border border-accent-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Precio"
              type="number"
              step="0.01"
              value={newItem.price || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, price: parseFloat(e.target.value) })
              }
              placeholder="12.50"
            />
          </div>
          <div className="mb-4">
            <Input
              label="Descripción"
              value={newItem.description || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              placeholder="Describe el plato"
            />
          </div>
          <Button onClick={handleAddItem} className="w-full">
            ➕ Agregar Plato
          </Button>
        </Card>

        {/* Menu Items List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className={`p-4 ${
                  !item.available ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-accent-800">
                        {item.name}
                      </h3>
                      <span className="text-sm">
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                    <p className="text-sm text-accent-600 mb-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 mb-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={item.available ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleToggleAvailability(item.id)}
                  >
                    {item.available ? '✓ Disponible' : '✕ No Disponible'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default MenuManagement;
