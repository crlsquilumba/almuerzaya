# ALMUERZA YA - TECHNICAL SPECIFICATION v2.0

## 📋 Documento de Especificación Técnica
**Versión:** 2026 SaaS Engine v1.3.0
**Actualizado:** 30/05/2026
**Empresa:** MicLabs Tech - Inteligencia Operativa para Negocios Locales

---

## 🎯 VISIÓN GENERAL

**Almuerza Ya** es una plataforma SaaS B2B que digitaliza la operación de restaurantes pequeños y medianos. Permite que propietarios gestionen su menú diario, reciban órdenes de clientes cercanos (radio 5km), y sincronicen la cocina en tiempo real usando algoritmos de geolocalización.

### Usuarios Principales
- **Restaurant Owners:** Registran su local y gestionan menú + pedidos
- **Admins/Support:** Monitorean plataforma y restaurantes
- **Clientes (Mobile):** Descubren restaurantes cercanos y realizan pedidos (app móvil - v3.0)

---

## 📐 ESTRUCTURA DE HEADER CONSISTENTE

**Componente:** `Header.tsx` (Reutilizable en todas las páginas)

**Estructura Visual (Todas las páginas):**
```
┌────────────────────────────────────────────────┐
│ 🍽️ ALMUERZA YA              [BOTONES OPCIONALES] │
│ GESTIÓN DE RESTAURANTE                         │
├────────────────────────────────────────────────┤
│ [CONTENIDO ADICIONAL OPCIONAL: Progress, etc]  │
└────────────────────────────────────────────────┘
```

**Propiedades del Header:**
- `showLoginButton?: boolean` - Botón "INICIAR SESIÓN" (Landing)
- `showBackButton?: boolean` - Botón "← ATRÁS" (Login, Onboarding)
- `backPath?: string` - Ruta del botón atrás (default: "/landing")
- `backLabel?: string` - Texto del botón atrás
- `children?: React.ReactNode` - Contenido adicional (ej: Progress indicator)

**Alto del Header:** Consistente en todas las páginas
- Padding: `py-5` = 20px (arriba y abajo)
- Border: Gris claro `border-gray-100`
- Shadow: Sutil `shadow-sm`
- Z-index: `z-50` (sticky)

**Páginas que usan Header:**
1. ✅ **Landing** (`/landing`) - Con botón "INICIAR SESIÓN"
2. ✅ **Login** (`/login`) - Con botón "← ATRÁS"
3. ✅ **Onboarding** (`/onboarding`) - Con botón "← ATRÁS" + Progress indicator
4. ✅ **Dashboard** (`/restaurant-dashboard`) - (próximo)
5. ✅ **Menú** (`/menu`) - (próximo)
6. ✅ **Cocina** (`/kitchen`) - (próximo)

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico

#### Backend
- **Framework:** NestJS 10 (TypeScript)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** JWT + Refresh Tokens
- **API:** RESTful (/api/v1)

#### Frontend Web (Restaurant Dashboard)
- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **State Management:** Zustand
- **Styling:** Tailwind CSS + PostCSS
- **HTTP Client:** Axios
- **Router:** React Router v6

#### Design System
- **Color Scheme:**
  - Primary (Red/KFC): `#E4002B`
  - Dark: `#111827` / `#1a1a1a`
  - Light Gray: `#F4F4F5` / `#e5e7eb`
- **Typography:** Inter (Google Fonts)
- **Spacing:** 8px base unit

---

## 📱 INTERFAZ DE USUARIO

### VISTA 0: LANDING PAGE (Público)

**URL:** `http://localhost:5173/landing` (ruta por defecto también)

#### Descripción
Página de inicio que muestra todos los restaurantes registrados en la plataforma. Similar a Uber Eats o DoorDash, donde los usuarios pueden ver los logos y nombre de los restaurantes disponibles.

#### Estructura
```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ 🍽️ ALMUERZA YA | INICIAR SESIÓN →                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ HERO SECTION                                            │
│ Digitaliza tu menú diario en 3 clics...               │
│ [CTA: Registra tu Restaurante]                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ RESTAURANTES DISPONIBLES (Grid de Logos)              │
│                                                         │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│ │ Logo │  │ Logo │  │ Logo │  │ Logo │  │ Logo │    │
│ │ Nbre │  │ Nbre │  │ Nbre │  │ Nbre │  │ Nbre │    │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘    │
│                                                         │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│ │ Logo │  │ Logo │  │ Logo │  │ Logo │  │ Logo │    │
│ │ Nbre │  │ Nbre │  │ Nbre │  │ Nbre │  │ Nbre │    │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│ MicLabs Tech © 2026                                    │
└─────────────────────────────────────────────────────────┘
```

#### Características
- Grid de restaurantes responsivo (5 columnas en desktop, 3 en tablet, 1 en mobile)
- Cada tarjeta muestra:
  - Logo/Imagen (cuadrado 120x120px)
  - Nombre del restaurante
  - Efecto hover (escala, sombra)
  - Sin información de menú ni precios (solo descubrimiento visual)
- Loading skeleton mientras carga datos
- Empty state si no hay restaurantes registrados
- Fetch de `/api/v1/restaurants` al cargar la página

---

### VISTA 1: ONBOARDING (Público)

**URL:** `http://localhost:5173/onboarding`

#### Flujo
1. Usuario hace click en "Registra tu Restaurante" desde landing o va directamente a `/onboarding`
2. Completa formulario en 3 pasos progresivos:
   - **Paso 1:** Datos del Restaurante (Nombre, Logo/Foto, Teléfono, Cuenta DeUna)
   - **Paso 2:** Ubicación Física (Dirección, Coordenadas GPS)
   - **Paso 3:** Datos del Propietario (Nombre, Apellido, Email, Contraseña, Confirmar Contraseña)
3. Sistema crea usuario (rol: RESTAURANT_OWNER) y restaurante
4. Redirige a dashboard (`/restaurant-dashboard`)

#### Elementos Visuales
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER PROGRESIVO                                           │
│ 🍽️ ALMUERZA YA | 1️⃣ 2️⃣ 3️⃣ Indicador de Progreso         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PASO 1: CREAR RESTAURANTE                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Nombre Restaurante | Logo/Foto | Teléfono | DeUna │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [← ATRÁS]  [SIGUIENTE →]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Campos del Formulario por Paso

**PASO 1: Datos del Restaurante**

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| Nombre Restaurante | Text | 3-50 chars, requerido | Asados & Picañas |
| Logo/Foto Restaurante | File | JPG/PNG, max 5MB | logo.jpg |
| Teléfono | Tel | Ecuador (+593), requerido | +593912345678 |
| Cuenta DeUna | Text | Número de cuenta, requerido | 1234567890 |

**PASO 2: Ubicación Física**

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| Dirección | Text | 10-100 chars, requerido | Av. Principal 1234, Quito |
| Latitud | Number | -0.35 a -0.10, requerido | -0.2189 |
| Longitud | Number | -78.60 a -78.40, requerido | -78.4842 |

**PASO 3: Datos del Propietario**

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| Nombre Propietario | Text | 2-50 chars, requerido | Carlos |
| Apellido Propietario | Text | 2-50 chars, requerido | Quilumba |
| Email | Email | Único, válido, requerido | carlos@restaurante.com |
| Contraseña | Password | 8+ chars, requerido | SecurePass123 |
| Confirmar Contraseña | Password | Debe coincidir, requerido | SecurePass123 |

---

### VISTA 1.5: LOGIN (Público)

**URL:** `http://localhost:5173/login`

#### Diseño
Pantalla minimalista y profesional, inspirada en KFC (https://www.kfc.com.ec/auth/signin)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🍽️ ALMUERZA YA                    │
│                                                 │
│         INICIAR SESIÓN                          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Email o Usuario                          │  │
│  │ [_________________________]               │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Contraseña                               │  │
│  │ [_________________________]               │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [  INICIAR SESIÓN  ]                          │
│                                                 │
│  ────────  O  ────────                          │
│                                                 │
│  [ 🔵 CONTINUAR CON GOOGLE ]                   │
│                                                 │
│  ¿No tienes cuenta?                            │
│  → REGISTRA TU RESTAURANTE                      │
│                                                 │
│  ¿Olvidaste tu contraseña?                     │
│  → RECUPERAR ACCESO                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Campos
| Campo | Tipo | Validación | Requerido |
|-------|------|-----------|-----------|
| Email | Email | RFC 5322 válido | Sí |
| Contraseña | Password | Mínimo 8 chars | Sí |

#### Funcionalidades
1. **Login básico**
   - POST `/auth/signin` con `email` y `password`
   - Retorna `accessToken` y `refreshToken`
   - Guarda token en localStorage (key: `cpos-auth-storage`)

2. **Google SSO (Google Sign-In)**
   - Botón con branding Google
   - Implementa Google Identity (gsi)
   - Auto-registra o login si existe
   - Fallback: redirecciona a signup si es nuevo usuario

3. **Validaciones**
   - Email válido (regex o zod)
   - Contraseña no vacía
   - Mostrar errores debajo de cada campo
   - Error general: "Email o contraseña incorrectos"

4. **Estados**
   - **Normal:** Botones activos
   - **Loading:** Spinner en botón, inputs deshabilitados
   - **Error:** Mensaje rojo bajo formulario
   - **Success:** Redirecciona a `/restaurant-dashboard`

#### Estilos
- Fondo: Blanco puro
- Ancho máximo: 400px (centrado)
- Colores KFC:
  - Botón primario: Rojo #E4002B
  - Textos: Gris oscuro #1e293b
  - Bordes: Gris claro #e5e7eb
- Font: Inter
- Spacing: 8px base unit

#### API Consumido
```
POST /auth/signin
Body: {
  "email": "user@restaurante.com",
  "password": "SecurePass123"
}
Response: {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmpt93xam00002gjh8zxtq70w",
    "email": "user@restaurante.com",
    "firstName": "Carlos",
    "lastName": "Quilumba",
    "role": "RESTAURANT_OWNER"
  }
}
```

---

### VISTA 2: DASHBOARD OPERATIVO (Autenticado - RESTAURANT_OWNER)

**URL:** `http://localhost:5173/restaurant-dashboard`

#### Estructura General
```
┌──────────────────────────────────────────────────┐
│ HEADER PROFESIONAL (Sticky)                      │
│ Logo | Nombre Restaurante | Nav Tabs | Logout   │
├──────────────────────────────────────────────────┤
│                                                  │
│  MAIN CONTENT AREA (Tabs)                       │
│  ├─ TAB 1: TABLERO KANBAN DE PEDIDOS            │
│  │  ├─ Columna 1: Nuevos Pedidos (Amarillo)     │
│  │  ├─ Columna 2: En Cocina (Azul)              │
│  │  └─ Columna 3: Listo/Servir (Verde)          │
│  │                                              │
│  └─ TAB 2: MÓDULO MENÚ + PRODUCTOS              │
│     ├─ Formulario: Crear Nuevo Plato            │
│     └─ Tabla: Catálogo + Selección Diaria       │
│                                                  │
├──────────────────────────────────────────────────┤
│ FOOTER: Versión SaaS Engine                     │
└──────────────────────────────────────────────────┘
```

#### TAB 1: TABLERO KANBAN DE PEDIDOS

**Responsabilidad:** Visualizar pedidos en tiempo real y moverlos entre columnas

**Columnas:**
1. **Nuevos Pedidos** (Amarillo - `amber-500`)
   - Pedidos recibidos pero aún no iniciados
   - Acción: "Preparar Orden" → Mover a "En Cocina"

2. **En Cocina** (Azul - `blue-600`)
   - Pedidos que se están cocinando
   - Muestra: Estado, tiempo estimado, cliente
   - Info Extra: Distancia del cliente, ETA aproximado

3. **Listo/Servir** (Verde - `emerald-600`)
   - Pedidos completados y listos para despacho
   - Acción: "Liberar Mesa & Cerrar" → Finaliza el pedido
   - Notifica al cliente en su móvil

**Estructura de Card de Pedido:**
```
┌─────────────────────────────────────┐
│ Carlos Alberto Quilumba             │
│ 1x Almuerzo Ejecutivo Completo      │
├─────────────────────────────────────┤
│ Sopa: Locro de papa con queso       │
│ Fuerte: Picaña rústica a la parrilla│
├─────────────────────────────────────┤
│ $4.50 DeUna | A 850m | Hace 2m     │
├─────────────────────────────────────┤
│ [Preparar Orden] →                  │
└─────────────────────────────────────┘
```

**Integración con Backend:**
- **GET /reservations** → Obtener pedidos del restaurante
- **PATCH /reservations/:id/confirm** → Mover a "En Cocina"
- **PATCH /reservations/:id/complete** → Mover a "Listo"

---

#### TAB 2: MÓDULO MENÚ + PRODUCTOS

**Responsabilidad:** Gestionar catálogo de platos y configurar menú del día

**Sección A: Crear Nuevo Producto**
```
┌────────────────────────────────────────┐
│ 🎯 Registrar Nuevo Platillo           │
├────────────────────────────────────────┤
│ Nombre: [_____________]               │
│ Categoría: [Sopa ▼]                   │
│ Precio Extra: [$0.00]                 │
│                                        │
│ [Guardar en Catálogo] →               │
└────────────────────────────────────────┘
```

**Campos:**
| Campo | Tipo | Validación | Opciones |
|-------|------|-----------|----------|
| Nombre | Text | 3-80 chars | - |
| Categoría | Select | Requerido | Sopa, Segundo, Bebida |
| Precio Extra | Number | 0.00-5.00 | - |

**Sección B: Catálogo e Integración Menú**
```
┌─────────────────────────────────────────────────┐
│ Platillo         │ Categoría │ Precio │ Elegido│
├─────────────────────────────────────────────────┤
│ Locro de papa    │ Sopa      │ Inc.   │  ☑    │
│ Caldo de patas   │ Sopa      │ +0.50  │  ☐    │
│ Picaña rústica   │ Segundo   │ Inc.   │  ☑    │
│ Seco de chivo    │ Segundo   │ +1.00  │  ☐    │
│ Jugo de mora     │ Bebida    │ Inc.   │  ☑    │
└─────────────────────────────────────────────────┘
Menú Base: $4.50 | [Publicar Menú Diario]
```

**Lógica:**
- El usuario selecciona **1 Sopa** + **1 Segundo** mínimo
- Los checkboxes son excluyentes por categoría (solo 1 por tipo)
- Menú Base es fijo ($4.50)
- Precios Extra se suman solo si está seleccionado

**Integración con Backend:**
- **POST /menu-items** → Crear nuevo producto
- **GET /menu-items/restaurant/:id** → Listar productos
- **PUT /restaurants/:id** → Actualizar menú del día (productos activos)

---

## 🔐 AUTENTICACIÓN Y ROLES

### Flujo de Auth
```
1. Usuario registra en /onboarding
   ↓
2. Backend crea Usuario (role: RESTAURANT_OWNER)
   ↓
3. Backend devuelve JWT accessToken + refreshToken
   ↓
4. Frontend guarda en localStorage
   ↓
5. Axios Interceptor agrega "Authorization: Bearer {token}"
   ↓
6. Usuario accede a /restaurant-dashboard
```

### Roles Disponibles
- **RESTAURANT_OWNER:** Acceso a `/restaurant-dashboard`, `/menu`, `/kitchen`
- **ADMIN:** Acceso a `/admin`, `/admin/restaurants`, `/admin/users`
- **CUSTOMER:** Acceso solo a app móvil (v3.0)

### Protección de Rutas
```typescript
<ProtectedRoute
  path="/restaurant-dashboard"
  element={<RestaurantDashboard />}
  requiredRole="RESTAURANT_OWNER"
/>
```

---

## 📡 API ENDPOINTS CONSUMIDOS

### Auth
```
POST   /auth/signup          → Registrar usuario + restaurante
POST   /auth/signin          → Login
POST   /auth/refresh         → Renovar token
GET    /auth/me              → Usuario actual
POST   /auth/logout          → Cerrar sesión
```

### Restaurants
```
GET    /restaurants           → Listar restaurantes
GET    /restaurants/nearby    → Restaurantes cercanos (Geolocalización)
GET    /restaurants/:id       → Detalles del restaurante
POST   /restaurants           → Crear restaurante (protegido)
PATCH  /restaurants/:id       → Actualizar restaurante (protegido)
DELETE /restaurants/:id       → Eliminar restaurante (protegido)
```

### Menu Items
```
GET    /menu-items/restaurant/:id    → Platos de un restaurante
GET    /menu-items/:id               → Detalles de un plato
POST   /menu-items                   → Crear plato (protegido)
PATCH  /menu-items/:id               → Actualizar plato (protegido)
DELETE /menu-items/:id               → Eliminar plato (protegido)
```

### Reservations (Pedidos)
```
GET    /reservations                         → Mis pedidos (protegido)
GET    /reservations/:id                     → Detalles pedido
POST   /reservations                         → Crear pedido (protegido)
PATCH  /reservations/:id/confirm             → Confirmar pedido
PATCH  /reservations/:id/cancel              → Cancelar pedido
GET    /reservations/available-slots/:id     → Horarios disponibles
```

### Payments
```
POST   /payments                      → Crear pago (protegido)
GET    /payments/:id                  → Detalles pago
POST   /payments/:id/upload-proof     → Subir comprobante (protegido)
PATCH  /payments/:id/verify           → Verificar pago (protegido)
PATCH  /payments/:id/complete         → Completar pago (protegido)
```

---

## 💾 ESTRUCTURA DE DATOS

### User
```json
{
  "id": "cmpt4u7jx00011q36ik669gfr",
  "email": "chef@asados.com",
  "firstName": "Carlos",
  "lastName": "Quilumba",
  "phone": "+593912345678",
  "role": "RESTAURANT_OWNER",
  "createdAt": "2026-05-30T21:00:00Z"
}
```

### Restaurant
```json
{
  "id": "rest123",
  "name": "Asados & Picañas El Inca",
  "phone": "+593212345678",
  "address": "Av. Colón 1234, Quito",
  "latitude": -0.2189,
  "longitude": -78.4842,
  "ownerId": "cmpt4u7jx00011q36ik669gfr",
  "isOpen": true,
  "openingTime": "11:00",
  "closingTime": "22:00",
  "createdAt": "2026-05-30T21:05:00Z"
}
```

### MenuItem
```json
{
  "id": "item456",
  "name": "Locro de papa con queso",
  "description": "Locro tradicional ecuatoriano",
  "price": 0.00,
  "category": "Sopa",
  "available": true,
  "restaurantId": "rest123",
  "createdAt": "2026-05-30T21:10:00Z"
}
```

### Reservation (Pedido)
```json
{
  "id": "res789",
  "reservationCode": "RES-20260530-001",
  "userId": "user456",
  "restaurantId": "rest123",
  "reservationDate": "2026-05-30T12:30:00Z",
  "reservationTime": "12:30",
  "partySize": 1,
  "status": "PENDING",
  "items": [
    {
      "menuItemId": "item456",
      "quantity": 1,
      "unitPrice": 4.50
    }
  ],
  "createdAt": "2026-05-30T11:45:00Z"
}
```

---

## 🎨 COMPONENTES REACT A IMPLEMENTAR

### Páginas
1. **OnboardingRestaurant.tsx**
   - Formulario 3 pasos
   - POST /auth/signup + POST /restaurants
   - Manejo de errores

2. **RestaurantDashboard.tsx**
   - Contenedor principal
   - Tabs: Pedidos | Menú
   - GET /reservations, GET /menu-items

3. **KitchenDashboard.tsx** (Kanban)
   - Columnas drag-drop
   - PATCH /reservations/:id/confirm|cancel

4. **MenuManagement.tsx**
   - CRUD de productos
   - POST /menu-items, PATCH, DELETE
   - Selector menú del día

### Stores (Zustand)
```typescript
// restaurantStore.ts
interface RestaurantState {
  restaurant: Restaurant | null
  menuItems: MenuItem[]
  reservations: Reservation[]
  loadRestaurant(id): Promise<void>
  addMenuItem(data): Promise<void>
  updateMenuDay(items): Promise<void>
}

// reservationStore.ts
interface ReservationState {
  reservations: Reservation[]
  fetchReservations(): Promise<void>
  moveToPrep(id): Promise<void>
  moveToReady(id): Promise<void>
  finalize(id): Promise<void>
}
```

### Services
```typescript
// restaurantService.ts
class RestaurantService {
  async create(data): Promise<Restaurant>
  async update(id, data): Promise<Restaurant>
  async getAll(): Promise<Restaurant[]>
}

// menuItemService.ts
class MenuItemService {
  async create(data): Promise<MenuItem>
  async getByRestaurant(id): Promise<MenuItem[]>
  async update(id, data): Promise<MenuItem>
  async delete(id): Promise<void>
}

// reservationService.ts
class ReservationService {
  async getAll(): Promise<Reservation[]>
  async confirm(id): Promise<Reservation>
  async complete(id): Promise<Reservation>
}
```

---

## 🎯 FLUJOS PRINCIPALES

### Flujo 1: Onboarding Completo
```
Usuario
  ↓
[/onboarding] Formulario 3 pasos
  ↓
POST /auth/signup {email, password, firstName, lastName, phone, role: RESTAURANT_OWNER}
  ↓
Backend crea User + Restaurant
  ↓
Devuelve {accessToken, refreshToken, user}
  ↓
Frontend guarda en localStorage
  ↓
Redirige a /restaurant-dashboard
  ↓
GET /restaurants (filtrar por ownerId)
  ↓
Muestra Dashboard con datos del restaurante
```

### Flujo 2: Gestión de Menú
```
Chef en Tab 2 "Menú"
  ↓
Completa "Registrar Nuevo Platillo"
  ↓
POST /menu-items {nombre, categoria, precioExtra, restaurantId}
  ↓
Aparece en tabla "Catálogo"
  ↓
Chef selecciona 1 Sopa + 1 Segundo
  ↓
Click "Publicar Menú Diario"
  ↓
PATCH /restaurants/:id {menuItemsActivos: [id1, id2, ...]}
  ↓
Sistema sincroniza con clientes móviles
```

### Flujo 3: Procesar Pedido (Kanban)
```
Cliente móvil realiza pedido
  ↓
Backend crea Reservation {status: PENDING}
  ↓
WebSocket notifica al dashboard (real-time)
  ↓
Aparece en columna "Nuevos Pedidos"
  ↓
Chef hace click "Preparar Orden"
  ↓
PATCH /reservations/:id/confirm
  ↓
Mueve a columna "En Cocina"
  ↓
Chef termina de cocinar
  ↓
Click "Listo para Servir"
  ↓
PATCH /reservations/:id/complete
  ↓
Mueve a columna "Listo"
  ↓
Click "Liberar Mesa"
  ↓
Cliente recibe notificación + encuesta satisfacción
```

---

## ⚠️ MANEJO DE ERRORES

### Errores de Negocio (400-499)
```json
{
  "statusCode": 400,
  "message": "Email ya existe",
  "error": "BadRequestException"
}
```

**Frontend muestra:**
```
⚠️ Email ya existe
Por favor, usa otro email para registrarte.
```

### Errores de Auth (401)
```json
{
  "statusCode": 401,
  "message": "Token expirado",
  "error": "UnauthorizedException"
}
```

**Frontend:**
- Redirige a /login
- Limpia localStorage
- Muestra mensaje en Alert

### Errores de Servidor (500+)
```
❌ Error del servidor
Intenta de nuevo más tarde o contacta a support.
```

---

## 📊 MONITOREO Y LOGS

### Frontend Logging (Console)
```typescript
console.log('📝 [ONBOARDING] Iniciando registro...')
console.log('✅ [DASHBOARD] Datos cargados correctamente')
console.error('❌ [ERROR] Error al cargar pedidos:', error)
```

### Backend Logging
```typescript
this.logger.log('🏪 [RESTAURANT] Restaurante creado: ' + id)
this.logger.warn('⚠️ [KITCHEN] Pedido con retraso')
this.logger.error('❌ [DB] Error de conexión')
```

---

## 🔄 GEOLOCALIZACIÓN

### Fórmula Haversine
```
Distancia = 2 * R * arcsin(sqrt(sin²((lat2-lat1)/2) + cos(lat1)*cos(lat2)*sin²((lon2-lon1)/2)))
Donde R = 6371 km (radio tierra)
```

### Radio de Cobertura
- **Default:** 5 km
- **Configurable:** Por restaurante
- **Validación:** En signup y búsqueda de clientes

---

## 📱 VERSIONES FUTURAS

- **v2.1:** WebSocket para pedidos en tiempo real
- **v3.0:** App móvil para clientes (React Native)
- **v3.5:** Analytics y reportes
- **v4.0:** Integraciones de pago (Stripe, PayPal)
- **v4.5:** Sistema de delivery

---

## 🚀 DEPLOYMENT

### Desarrollo
```bash
# Backend
cd apps/backend && npm run start:dev

# Frontend
cd apps/web && npm run dev
```

### Producción
```bash
# Backend
npm run build && npm start

# Frontend
npm run build
# Servir con: nginx, vercel, netlify
```

---

## 📞 CONTACTO & SOPORTE

**Empresa:** MicLabs Tech
**Email:** tech@miclabs.dev
**Documentación:** /docs
**Status:** https://status.almuerzaya.app

---

**Última actualización:** 30/05/2026 - v2.0 SaaS Engine
