import React from 'react';
import { Container } from '@components/layout/Container';

export const Payment: React.FC = () => {
  return (
    <Container maxWidth="2xl" className="py-8">
      <h1 className="text-3xl font-bold text-accent-800 mb-4">Pago</h1>
      <p className="text-accent-600">Página en desarrollo. Aquí se mostrará el QR de pago.</p>
    </Container>
  );
};

export default Payment;
