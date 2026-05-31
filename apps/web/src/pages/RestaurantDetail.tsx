import React from 'react';
import { Container } from '@components/layout/Container';

export const RestaurantDetail: React.FC = () => {
  return (
    <Container maxWidth="2xl" className="py-8">
      <h1 className="text-3xl font-bold text-accent-800 mb-4">
        Detalle del Restaurante
      </h1>
      <p className="text-accent-600">
        Página en desarrollo. Aquí se mostrará el menú y detalles del restaurante.
      </p>
    </Container>
  );
};

export default RestaurantDetail;
