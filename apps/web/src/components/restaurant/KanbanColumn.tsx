import React from 'react';

interface KanbanColumnProps {
  title: string;
  icon: string;
  color: 'amber' | 'blue' | 'emerald';
  badgeCount: number;
  reservations: any[];
  onAction: (reservationId: string) => void;
  actionLabel: string;
  actionColor: string;
  isLoading: boolean;
  isLastColumn?: boolean;
}

const colorMap = {
  amber: { header: 'bg-amber-500', bg: 'bg-amber-50', badge: 'bg-black/20' },
  blue: { header: 'bg-blue-600', bg: 'bg-blue-50', badge: 'bg-black/20' },
  emerald: { header: 'bg-emerald-600', bg: 'bg-emerald-50', badge: 'bg-black/20' },
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  icon,
  color,
  badgeCount,
  reservations,
  onAction,
  actionLabel,
  actionColor,
  isLoading,
  isLastColumn,
}) => {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className={`${colors.header} text-white px-4 py-3 flex justify-between items-center`}>
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {title}
        </span>
        <span className={`${colors.badge} text-white text-xs font-black px-2 py-0.5 rounded-full`}>
          {badgeCount}
        </span>
      </div>

      {/* Content */}
      <div className={`p-3 space-y-3 min-h-[420px] ${colors.bg}`}>
        {reservations.length === 0 ? (
          <p className="text-xs text-zinc-400 italic text-center py-8">
            {isLastColumn ? 'No hay platos listos para despacho todavía...' : 'Sin pedidos en cola...'}
          </p>
        ) : (
          reservations.map((reservation) => (
            <PedidoCard
              key={reservation.id}
              reservation={reservation}
              onAction={() => onAction(reservation.id)}
              actionLabel={actionLabel}
              actionColor={actionColor}
              isLoading={isLoading}
              isLastColumn={isLastColumn}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface PedidoCardProps {
  reservation: any;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
  isLoading: boolean;
  isLastColumn?: boolean;
}

const PedidoCard: React.FC<PedidoCardProps> = ({
  reservation,
  onAction,
  actionLabel,
  actionColor,
  isLoading,
  isLastColumn,
}) => {
  const customerName = reservation.user?.firstName + ' ' + reservation.user?.lastName || 'Cliente';
  const time = new Date(reservation.createdAt);
  const timeAgo = getTimeAgo(time);

  // Get menu items from reservation
  const items = reservation.items || [];

  const actionButtonColors: Record<string, string> = {
    zinc: 'bg-zinc-900 hover:bg-black',
    blue: 'bg-blue-600 hover:bg-blue-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
  };

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm space-y-3 ${
      isLastColumn ? 'border-2 border-emerald-500' : 'border-zinc-200'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-black text-zinc-900 text-sm">{customerName}</h4>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            {items.length}x Almuerzo
          </p>
        </div>
        <span className="text-[10px] bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded">
          {timeAgo}
        </span>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 text-[11px] font-semibold text-zinc-600 space-y-1">
          {items.map((item: any, idx: number) => (
            <p key={idx}>
              <span className="text-zinc-400">{idx === 0 ? 'Sopa:' : 'Fuerte:'}</span>{' '}
              <span>{item.menuItem?.name || 'Producto'}</span>
            </p>
          ))}
        </div>
      )}

      {/* Details */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs font-black bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded">
          💰 ${reservation.items?.reduce((sum: number, item: any) => sum + (item.unitPrice || 0), 0).toFixed(2) || '0.00'}
        </span>
        <span className="text-[11px] text-zinc-400 font-bold">
          📍 {Math.random() * 2 + 0.5}km
        </span>
      </div>

      {/* Action Button */}
      {!isLastColumn && (
        <button
          onClick={onAction}
          disabled={isLoading}
          className={`w-full ${actionButtonColors[actionColor]} text-white text-xs font-black py-2.5 rounded-lg transition uppercase tracking-tight flex items-center justify-center gap-2 disabled:opacity-50`}
        >
          {actionLabel} {isLoading ? '⏳' : '→'}
        </button>
      )}

      {isLastColumn && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[10px] font-semibold text-emerald-700">
          <p>✅ Plato listo en el pasillo de entrega</p>
        </div>
      )}
    </div>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  return `Hace ${diffHours}h`;
}

export default KanbanColumn;
