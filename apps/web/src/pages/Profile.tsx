import React from 'react';
import { Container } from '@components/layout/Container';
import { useAuth } from '@hooks/useAuth';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="2xl" className="py-8">
      <h1 className="text-3xl font-bold text-accent-800 mb-4">Mi Perfil</h1>
      {user && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-accent-600 mb-2">
            <strong>Nombre:</strong> {user.firstName} {user.lastName}
          </p>
          <p className="text-accent-600 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-accent-600">
            <strong>Teléfono:</strong> {user.phone}
          </p>
        </div>
      )}
    </Container>
  );
};

export default Profile;
