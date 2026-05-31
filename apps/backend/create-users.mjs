import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../sqlite/almuerza-ya.db');
const db = new Database(dbPath);

const password = 'Password123!';
const hashedPassword = bcrypt.hashSync(password, 10);

try {
  // Insertar restaurant_owner
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password, firstName, lastName, phone, role, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'user-rest-001',
    'restaurant@test.com',
    hashedPassword,
    'Test',
    'Restaurant',
    '+593912345678',
    'restaurant_owner',
    1,
    new Date().toISOString(),
    new Date().toISOString()
  );

  // Insertar admin
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password, firstName, lastName, phone, role, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'user-admin-001',
    'admin@test.com',
    hashedPassword,
    'Admin',
    'User',
    '+593987654321',
    'admin',
    1,
    new Date().toISOString(),
    new Date().toISOString()
  );

  console.log('✅ Usuarios creados exitosamente:\n');
  console.log('📧 RESTAURANT OWNER:');
  console.log('   Email: restaurant@test.com');
  console.log('   Pass:  Password123!\n');
  console.log('📧 ADMIN:');
  console.log('   Email: admin@test.com');
  console.log('   Pass:  Password123!\n');

  const users = db.prepare('SELECT id, email, role FROM users').all();
  console.log('📋 Total usuarios en BD:', users.length);
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
