import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

export const ReservationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
          <h1 className="text-4xl font-bold text-accent-800">
            Detalle de Reservación #{id}
          </h1>
        </div>

        <Card className="p-8">
          <p className="text-accent-600 text-center">
            Página en desarrollo. Se implementará la visualización detallada de reservaciones.
          </p>
        </Card>
      </div>
    </Container>
  );
};

export default ReservationDetail;
