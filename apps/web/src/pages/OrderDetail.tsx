import React from 'react';
import { Container } from '@components/layout/Container';

export const OrderDetail: React.FC = () => {
  return (
    <Container maxWidth="2xl" className="py-8">
      <h1 className="text-3xl font-bold text-accent-800 mb-4">Detalle de Orden</h1>
      <p className="text-accent-600">Página en desarrollo. Aquí se mostrará el detalle de la orden.</p>
    </Container>
  );
};

export default OrderDetail;
