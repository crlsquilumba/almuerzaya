import React, { useState } from 'react';
import reservationService from '@services/reservation.service';
import KanbanColumn from './KanbanColumn';
import { Alert } from '@components/ui/Alert';

interface KanbanBoardProps {
  reservations: any[];
  onRefresh: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  reservations,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Separar reservaciones por status
  const newReservations = reservations.filter((r) => r.status === 'PENDING');
  const cookingReservations = reservations.filter((r) => r.status === 'CONFIRMED');
  const readyReservations = reservations.filter((r) => r.status === 'READY_FOR_PICKUP');

  const handleMoveToKitchen = async (reservationId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🍳 [KANBAN] Moviendo a cocina:', reservationId);
      await reservationService.confirm(reservationId);
      console.log('✅ [KANBAN] Pedido movido a cocina');
      onRefresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error al confirmar pedido';
      setError(msg);
      console.error('❌ [KANBAN] Error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToReady = async (reservationId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('✅ [KANBAN] Pedido listo:', reservationId);
      // Aquí iría un endpoint para marcar como READY_FOR_PICKUP
      // Por ahora usamos complete
      console.log('⚠️ [KANBAN] Endpoint READY_FOR_PICKUP no disponible en backend');
      // await reservationService.complete(reservationId);
      onRefresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error al completar pedido';
      setError(msg);
      console.error('❌ [KANBAN] Error:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error">
          <span>⚠️ {error}</span>
        </Alert>
      )}

      {/* Grid de columnas Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* COLUMNA 1: NUEVOS PEDIDOS */}
        <KanbanColumn
          title="Nuevos Pedidos"
          icon="🔔"
          color="amber"
          badgeCount={newReservations.length}
          reservations={newReservations}
          onAction={handleMoveToKitchen}
          actionLabel="Preparar Orden"
          actionColor="zinc"
          isLoading={loading}
        />

        {/* COLUMNA 2: EN COCINA */}
        <KanbanColumn
          title="En Cocina"
          icon="🔥"
          color="blue"
          badgeCount={cookingReservations.length}
          reservations={cookingReservations}
          onAction={handleMoveToReady}
          actionLabel="Listo para Servir"
          actionColor="blue"
          isLoading={loading}
        />

        {/* COLUMNA 3: LISTO PARA SERVIR */}
        <KanbanColumn
          title="Listo / Servir"
          icon="✓"
          color="emerald"
          badgeCount={readyReservations.length}
          reservations={readyReservations}
          onAction={() => onRefresh()}
          actionLabel="Completar Pedido"
          actionColor="emerald"
          isLoading={loading}
          isLastColumn={true}
        />
      </div>

      {/* Info Footer */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm text-center">
        <p className="text-sm text-zinc-600">
          <span className="font-bold text-zinc-900">{reservations.length}</span> pedidos en total
          {newReservations.length > 0 && (
            <span className="ml-2 text-amber-600 font-bold">
              ({newReservations.length} nuevos)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default KanbanBoard;
