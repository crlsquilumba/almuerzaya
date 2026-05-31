import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import adminService, { AdminUser } from '@services/admin.service';

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('👥 [ADMIN] Fetching users...');
        setIsLoading(true);
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('❌ [ADMIN] Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = async (userId: string) => {
    try {
      console.log(`🔄 [ADMIN] Toggling active status for user ${userId}`);
      const updated = await adminService.toggleUserActive(userId);

      if (updated) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, isActive: updated.isActive } : u
          )
        );
        console.log('✅ [ADMIN] User status toggled successfully');
      }
    } catch (error) {
      console.error('❌ [ADMIN] Error toggling user:', error);
    }
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-4 items-center">
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            ← Volver
          </Button>
          <h1 className="text-4xl font-bold text-accent-800">
            👥 Gestión de Usuarios
          </h1>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-200">
                  <th className="text-left p-4 font-semibold text-accent-800">
                    Usuario
                  </th>
                  <th className="text-left p-4 font-semibold text-accent-800">
                    Email
                  </th>
                  <th className="text-left p-4 font-semibold text-accent-800">
                    Tipo
                  </th>
                  <th className="text-left p-4 font-semibold text-accent-800">
                    Estado
                  </th>
                  <th className="text-left p-4 font-semibold text-accent-800">
                    Fecha Registro
                  </th>
                  <th className="text-center p-4 font-semibold text-accent-800">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-accent-100 ${
                      !user.isActive ? 'opacity-60 bg-gray-50' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-accent-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-accent-600">{user.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-accent-700">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.userType === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.userType === 'restaurant_owner'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {user.userType === 'restaurant_owner'
                          ? 'Restaurante'
                          : user.userType === 'admin'
                          ? 'Admin'
                          : 'Cliente'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-accent-600">
                      {user.createdAt}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant={user.isActive ? 'secondary' : 'primary'}
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.isActive ? '🚫 Desactivar' : '✓ Activar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdminUsers;
