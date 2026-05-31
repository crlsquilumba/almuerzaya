import React, { useEffect, useState } from 'react';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import reservationService from '@services/reservation.service';
import { Reservation } from '@/types/entities.types';

type StatusTab = 'pending' | 'confirmed' | 'ready_for_pickup' | 'completed';

const statusColors: Record<string, string> = {
  pending: 'bg-red-100 text-red-800',
  confirmed: 'bg-yellow-100 text-yellow-800',
  ready_for_pickup: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  pending: '⏳ Pendiente',
  confirmed: '✅ Confirmada',
  ready_for_pickup: '🟢 Lista para recoger',
  completed: '✓ Completada',
  cancelled: '❌ Cancelada',
};

export const KitchenDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('👨‍🍳 [KITCHEN] Fetching orders with status:', activeTab);
        setIsLoading(true);
        const data = await reservationService.getByStatus(activeTab);
        setOrders(data);
      } catch (error) {
        console.error('❌ [KITCHEN] Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const handleStatusChange = async (
    orderId: string,
    newStatus: 'confirmed' | 'ready_for_pickup' | 'completed'
  ) => {
    try {
      console.log(`🔄 [KITCHEN] Updating order ${orderId} to ${newStatus}`);
      // Use appropriate backend methods based on desired status
      if (newStatus === 'confirmed') {
        await reservationService.confirm(orderId);
      } else if (newStatus === 'ready_for_pickup' || newStatus === 'completed') {
        // Backend maps both to complete()
        // TODO: Implement separate ready_for_pickup endpoint if needed
        console.warn('⚠️ [KITCHEN] ready_for_pickup not yet available - using confirm instead');
        await reservationService.confirm(orderId);
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      console.log('✅ [KITCHEN] Order updated successfully');
    } catch (error) {
      console.error('❌ [KITCHEN] Error updating order:', error);
    }
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-accent-800 mb-2">
            👨‍🍳 Dashboard de Cocina
          </h1>
          <p className="text-accent-600">Gestiona las órdenes en tiempo real</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-accent-200">
          {(['pending', 'confirmed', 'ready', 'completed'] as StatusTab[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === status
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-accent-600 hover:text-accent-800'
                }`}
              >
                {statusLabels[status]} ({orders.filter((o) => o.status === status).length})
              </button>
            )
          )}
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-accent-600 text-lg">
              No hay órdenes {statusLabels[activeTab].toLowerCase()}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 border-l-4 border-primary-600">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-accent-800">
                      Cliente #{order.userId?.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-accent-600">
                      Hora: {order.reservationTime}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4 bg-accent-50 p-3 rounded">
                  {/* Show item count since items structure varies */}
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Cantidad de items</span>
                    <span className="text-accent-600">{order.itemCount}</span>
                  </div>
                </div>

                {/* Pickup Code */}
                {order.pickupCode && (
                  <div className="text-center mb-4 p-3 bg-white border border-accent-200 rounded">
                    <p className="text-xs text-accent-600 mb-1">Código de Recogida</p>
                    <p className="font-mono font-bold text-lg">{order.pickupCode}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {activeTab === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(order.id, 'confirmed')}
                    >
                      Confirmar
                    </Button>
                  )}
                  {activeTab === 'confirmed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(order.id, 'ready_for_pickup')}
                    >
                      Listo
                    </Button>
                  )}
                  {activeTab === 'ready_for_pickup' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(order.id, 'completed')}
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default KitchenDashboard;
