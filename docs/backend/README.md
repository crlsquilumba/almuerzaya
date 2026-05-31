# Backend - Almuerza Ya

API REST para la plataforma de pre-orden de almuerzos "Almuerza Ya".

## Stack Tecnológico

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.x
- **Database:** SQLite 3 (local) / Firestore (producción)
- **Auth:** JWT + Firebase Admin SDK
- **Validation:** Zod
- **Security:** bcryptjs, helmet, express-rate-limit, CORS

## Instalación

```bash
# Instalar dependencias
npm install

# (Opcional) Instalar globalmente para desarrollo
npm install -g ts-node
```

## Configuración

### 1. Variables de Entorno (.env.local)

```bash
# Copiar template
cp .env.local .env.local
```

Editar `.env.local` con tus valores:

```env
NODE_ENV=development
API_PORT=3000
JWT_SECRET=tu-secret-aleatorio-32-caracteres-minimo
FIREBASE_PROJECT_ID=almuerza-ya-dev
FIREBASE_SERVICE_ACCOUNT_PATH=../../firebase-service-account.json
DATABASE_TYPE=sqlite
SQLITE_PATH=../../sqlite/almuerza-ya.db
```

### 2. Credenciales Firebase (Opcional)

Si necesitas integrar con Firestore:

1. Ir a: https://console.firebase.google.com
2. Crear proyecto "almuerza-ya-dev"
3. Project Settings → Service Accounts → Generate JSON Key
4. Guardar en raíz del proyecto como `firebase-service-account.json`

## Ejecución

### Desarrollo (con hot-reload)

```bash
npm run dev
```

Verás:
```
✓ Server running on http://localhost:3000
✓ SQLite database initialized
```

### Producción

```bash
npm run build
npm start
```

### Pruebas

```bash
npm test              # Ejecutar tests
npm run test:coverage # Con coverage
```

## API Endpoints

### Autenticación (sin JWT)

- `POST /api/v1/auth/signup` - Registrar usuario
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/logout` - Logout

### Autenticado (requiere JWT)

- `GET /api/v1/auth/me` - Información del usuario
- `GET /api/v1/restaurants` - Listar restaurantes
- `GET /api/v1/reservations` - Mis reservaciones
- `POST /api/v1/reservations` - Crear reservación
- `GET /api/v1/payments` - Mis pagos
- `GET /api/v1/ratings` - Mis calificaciones

### Health Check

- `GET /health` - Estado de la API

## Estructura de Carpetas

```
src/
├── index.ts                    # Punto de entrada
├── api/
│   └── rest/
│       ├── controllers/        # Lógica HTTP
│       ├── routes/             # Definición de rutas
│       └── middleware/         # Auth, validación, errores
├── auth/
│   ├── services/               # Servicios de autenticación
│   └── middleware/             # JWT verification
├── core/
│   ├── domain/
│   │   ├── entities/           # Modelos de negocio
│   │   └── repositories/       # Interfaces (SPRINT 2+)
│   └── application/
│       └── dtos/               # Validación (Zod schemas)
├── payment/                    # SPRINT 4
├── notification/               # SPRINT 3
├── storage/                    # SPRINT 5
└── shared/
    ├── utils/                  # Firebase, Database, Helpers
    ├── constants/              # Valores constantes
    └── types/                  # Tipos TypeScript
```

## Arquitectura

**Hexagonal Minimalista:**

```
Request → Route → Controller → Service → Database
           ↓         ↓           ↓
       Express    Handler    Business Logic
```

## Seguridad

- **JWT:** Tokens con expiración 7 días
- **Passwords:** Hasheados con bcryptjs (salt 10)
- **Rate Limiting:** 100 requests / 15 minutos
- **CORS:** Solo http://localhost:5173 y http://localhost:3000
- **Helmet:** Headers de seguridad HTTP

## Troubleshooting

### Puerto 3000 en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### SQLite locked

```bash
rm sqlite/almuerza-ya.db-wal
rm sqlite/almuerza-ya.db-shm
npm run dev
```

### Firebase credentials not found

- Descargar archivo JSON desde Firebase Console
- Guardar como `firebase-service-account.json` en raíz
- O dejar en blanco para modo development

## Next Steps (SPRINT 2)

- [ ] Implementar RestaurantService
- [ ] CRUD completo de restaurantes
- [ ] Validación de ubicación (Haversine)
- [ ] Filtrado por distancia (5km)

---

**Status:** ✅ SPRINT 1 Backend completado
**Última actualización:** 2026-05-30
