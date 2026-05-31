const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findUsers() {
  try {
    console.log('🔍 Buscando usuarios en la base de datos...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);
    console.table(users);

    console.log('\n📋 Detalles:');
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`   Teléfono: ${user.phone || 'N/A'}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

findUsers();
