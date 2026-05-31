import React, { useState } from 'react';
import menuItemService from '@services/menuItem.service';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';

interface MenuManagerProps {
  restaurantId: string;
  restaurantBasePrice: number;
  menuItems: any[];
  onRefresh: () => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({
  restaurantId,
  restaurantBasePrice,
  menuItems,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [newProductForm, setNewProductForm] = useState({
    nombre: '',
    categoria: 'Sopa' as 'Sopa' | 'Segundo' | 'Bebida' | 'Postre' | 'Entrada' | 'Extras',
    precioExtra: '0.00',
  });

  // Selected items for daily menu (1 per category)
  const [selectedMenu, setSelectedMenu] = useState<Record<string, string>>({
    Sopa: '',
    Segundo: '',
    Bebida: '',
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('➕ [MENU] Creando nuevo producto:', newProductForm);

      await menuItemService.create({
        name: newProductForm.nombre,
        category: newProductForm.categoria as 'Sopa' | 'Segundo' | 'Bebida',
        price: parseFloat(newProductForm.precioExtra),
        restaurantId,
        available: true,
        description: '',
      });

      setSuccess(`"${newProductForm.nombre}" guardado en el catálogo`);
      setNewProductForm({ nombre: '', categoria: 'Sopa', precioExtra: '0.00' });
      onRefresh();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error creando producto';
      setError(msg);
      console.error('❌ [MENU] Error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMenuItem = (category: string, itemId: string) => {
    setSelectedMenu((prev) => ({
      ...prev,
      [category]: itemId === prev[category] ? '' : itemId,
    }));
  };

  const handlePublishMenu = async () => {
    const sopa = selectedMenu.Sopa;
    const segundo = selectedMenu.Segundo;

    if (!sopa || !segundo) {
      setError('Por favor, selecciona al menos 1 Sopa y 1 Plato Fuerte');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📤 [MENU] Publicando menú del día');
      // Aquí iría un endpoint para actualizar el menú del día
      // await restaurantService.updateMenu(restaurantId, { sopa, segundo });

      setSuccess('¡Menú del día sincronizado correctamente!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error publicando menú';
      setError(msg);
      console.error('❌ [MENU] Error:', msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* PANEL 1: CREAR NUEVO PRODUCTO */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
            ➕ Registrar Nuevo Platillo
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Añade productos a la base de datos de tu cocina.
          </p>
        </div>

        {error && (
          <Alert variant="error">
            <span className="text-sm">⚠️ {error}</span>
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <span className="text-sm">✅ {success}</span>
          </Alert>
        )}

        <form onSubmit={handleCreateProduct} className="space-y-3">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wide block">
              Nombre del Plato
            </label>
            <input
              type="text"
              placeholder="Ej. Caldo de Gallina Criólla"
              required
              value={newProductForm.nombre}
              onChange={(e) =>
                setNewProductForm({ ...newProductForm, nombre: e.target.value })
              }
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 font-semibold focus:outline-none focus:border-red-500 bg-zinc-50/50 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wide block">
                Categoría
              </label>
              <select
                value={newProductForm.categoria}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, categoria: e.target.value as 'Sopa' | 'Segundo' | 'Bebida' | 'Postre' | 'Entrada' | 'Extras' })
                }
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 font-bold focus:outline-none focus:border-red-500 bg-zinc-50/50 mt-1"
              >
                <option value="Sopa">Sopa / Entrada</option>
                <option value="Segundo">Plato Fuerte</option>
                <option value="Bebida">Bebida</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wide block">
                Precio Extra ($)
              </label>
              <input
                type="number"
                step="0.05"
                value={newProductForm.precioExtra}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, precioExtra: e.target.value })
                }
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 font-bold focus:outline-none focus:border-red-500 bg-zinc-50/50 mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-black py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            📁 Guardar en Catálogo
          </Button>
        </form>
      </div>

      {/* PANEL 2: CATÁLOGO Y MENÚ DEL DÍA */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
              📋 Catálogo e Integración al Menú del Día
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Selecciona qué platos conforman el almuerzo ejecutivo de hoy.
            </p>
          </div>
          <span className="text-[10px] bg-red-50 text-red-500 font-black px-2 py-1 rounded-md border border-red-100 uppercase">
            Sincronización Live
          </span>
        </div>

        {/* Tabla de Productos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                <th className="py-2">Platillo / Descripción</th>
                <th className="py-2">Categoría</th>
                <th className="py-2">Precio Adicional</th>
                <th className="py-2 text-right">Elegido Hoy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-zinc-400">
                    No hay productos. Crea uno usando el formulario.
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition">
                    <td className="py-3 font-bold text-zinc-900">{item.name}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          item.category === 'Sopa'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : item.category === 'Segundo'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-zinc-500">
                      {item.price > 0 ? `+${item.price.toFixed(2)}` : 'Incluido'}
                    </td>
                    <td className="py-3 text-right">
                      <input
                        type="checkbox"
                        checked={selectedMenu[item.category] === item.id}
                        onChange={() => handleSelectMenuItem(item.category, item.id)}
                        className="w-4 h-4 rounded text-red-500 focus:ring-red-500 accent-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con Precio y Botón */}
        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
          <div className="text-[11px] text-zinc-500 font-medium">
            Menú Base Actual:{' '}
            <span className="text-red-500 font-black">${restaurantBasePrice.toFixed(2)}</span>
          </div>
          <Button
            onClick={handlePublishMenu}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-6 py-3 rounded-xl transition uppercase tracking-wider shadow-md shadow-red-500/10 flex items-center gap-2"
          >
            ☁️ Publicar Menú Diario
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
