import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Create test admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@almuerzaya.com' },
    update: {},
    create: {
      email: 'admin@almuerzaya.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Create restaurant owner
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'carlos@restaurante.com' },
    update: {},
    create: {
      email: 'carlos@restaurante.com',
      password: ownerPassword,
      firstName: 'Carlos',
      lastName: 'Quilumba',
      phone: '+593987654321',
      role: UserRole.RESTAURANT_OWNER,
    },
  });
  console.log('✅ Propietario creado:', owner.email);

  // Create 5 restaurants
  const restaurants = [
    {
      name: 'Restaurante La Casa',
      address: 'Calle Principal 123, Quito',
      phone: '+593987654321',
      email: 'info@lacasa.com',
      latitude: -0.2126,
      longitude: -78.4971,
      description: 'Comida tradicional ecuatoriana',
      imageUrl: 'https://via.placeholder.com/200',
      ownerId: owner.id,
      bankAccount: '1234567890',
      basePrice: 5.0,
      openingTime: '07:00',
      closingTime: '21:00',
    },
    {
      name: 'Buen Provecho',
      address: 'Avenida Amazonas 456, Quito',
      phone: '+593987654322',
      email: 'info@buenprovecho.com',
      latitude: -0.2150,
      longitude: -78.4950,
      description: 'Cocina fusión moderna',
      imageUrl: 'https://via.placeholder.com/200',
      ownerId: owner.id,
      bankAccount: '0987654321',
      basePrice: 6.5,
      openingTime: '11:00',
      closingTime: '22:00',
    },
    {
      name: 'Sabores del Litoral',
      address: 'Calle Garcia Moreno 789, Quito',
      phone: '+593987654323',
      email: 'info@saboresdelitoral.com',
      latitude: -0.2200,
      longitude: -78.4980,
      description: 'Mariscos y pescados frescos',
      imageUrl: 'https://via.placeholder.com/200',
      ownerId: owner.id,
      bankAccount: '5555555555',
      basePrice: 7.0,
      openingTime: '10:00',
      closingTime: '23:00',
    },
    {
      name: 'El Encanto Andino',
      address: 'Calle Bolívar 321, Quito',
      phone: '+593987654324',
      email: 'info@encantoandino.com',
      latitude: -0.2100,
      longitude: -78.5000,
      description: 'Gastronomía andina tradicional',
      imageUrl: 'https://via.placeholder.com/200',
      ownerId: owner.id,
      bankAccount: '4444444444',
      basePrice: 5.5,
      openingTime: '08:00',
      closingTime: '20:00',
    },
    {
      name: 'Comida Rápida del Buen Gusto',
      address: 'Avenida 10 de Agosto 654, Quito',
      phone: '+593987654325',
      email: 'info@crbgusto.com',
      latitude: -0.2175,
      longitude: -78.4960,
      description: 'Comida rápida de calidad',
      imageUrl: 'https://via.placeholder.com/200',
      ownerId: owner.id,
      bankAccount: '3333333333',
      basePrice: 4.5,
      openingTime: '07:00',
      closingTime: '22:00',
    },
  ];

  const createdRestaurants = [];
  for (const restaurantData of restaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { name: restaurantData.name },
      update: {},
      create: restaurantData,
    });
    createdRestaurants.push(restaurant);
    console.log('✅ Restaurante creado:', restaurant.name);
  }

  // Create menu items for first restaurant
  const menuItems = [
    {
      name: 'Sopa de Camarón',
      description: 'Deliciosa sopa con camarones frescos',
      price: 3.5,
      category: 'Sopa',
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: createdRestaurants[0].id,
    },
    {
      name: 'Seco de Chivo',
      description: 'Plato tradicional ecuatoriano',
      price: 8.0,
      category: 'Segundo',
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: createdRestaurants[0].id,
    },
    {
      name: 'Arroz con Mariscos',
      description: 'Arroz con camarones, almejas y calamares',
      price: 9.5,
      category: 'Segundo',
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: createdRestaurants[0].id,
    },
    {
      name: 'Jugo de Naranja Fresco',
      description: 'Jugo natural recién exprimido',
      price: 1.5,
      category: 'Bebida',
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: createdRestaurants[0].id,
    },
    {
      name: 'Flan',
      description: 'Flan casero delicioso',
      price: 2.0,
      category: 'Postre',
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: createdRestaurants[0].id,
    },
  ];

  for (const item of menuItems) {
    const menuItem = await prisma.menuItem.upsert({
      where: { restaurantId_name: { restaurantId: item.restaurantId, name: item.name } },
      update: {},
      create: item,
    });
    console.log('✅ Item de menú creado:', menuItem.name);
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
