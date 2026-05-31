# SPRINT 2 - Endpoints de Restaurantes y Menús

Estado: ✅ Completado
Archivos creados: 15 archivos
Líneas de código: ~2,200

## 📋 Resumen

SPRINT 2 implementa:
- ✅ RestaurantService (CRUD + geolocalización)
- ✅ MenuItemService (CRUD de items)
- ✅ Haversine para cálculo de distancias
- ✅ Filtrado por distancia (5km)
- ✅ Endpoints REST completos
- ✅ DTOs con validación Zod

---

## 🚀 Endpoints

### Restaurantes

#### 1. Crear Restaurante
```bash
POST /api/v1/restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "La Mejor Comida",
  "description": "Comida ecuatoriana tradicional",
  "address": "Quito, Ecuador, Calle Principal 123",
  "latitude": -0.2202,
  "longitude": -78.5124,
  "openingTime": "11:00",
  "closingTime": "20:00",
  "phone": "+593987654321",
  "ruc": "1234567890123",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "La Mejor Comida",
    "description": "Comida ecuatoriana tradicional",
    "address": "Quito, Ecuador, Calle Principal 123",
    "latitude": -0.2202,
    "longitude": -78.5124,
    "openingTime": "11:00",
    "closingTime": "20:00",
    "phone": "+593987654321",
    "isOpen": true,
    "subscriptionActive": true,
    "createdAt": "2026-05-30T10:30:00.000Z",
    "updatedAt": "2026-05-30T10:30:00.000Z"
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

#### 2. Listar Restaurantes
```bash
GET /api/v1/restaurants?page=1&limit=20&openNow=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1) - Número de página
- `limit` (default: 20) - Items por página
- `search` - Buscar por nombre o dirección
- `latitude` - Latitud (para filtro de distancia)
- `longitude` - Longitud (para filtro de distancia)
- `maxDistanceKm` (default: 5) - Radio máximo en km
- `openNow` (default: false) - Solo abiertos ahora
- `sortBy` (default: "name") - Ordenar por: name, distance, rating, createdAt

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "La Mejor Comida",
        "description": "Comida ecuatoriana tradicional",
        "address": "Quito, Ecuador, Calle Principal 123",
        "latitude": -0.2202,
        "longitude": -78.5124,
        "openingTime": "11:00",
        "closingTime": "20:00",
        "phone": "+593987654321",
        "isOpen": true,
        "subscriptionActive": true,
        "createdAt": "2026-05-30T10:30:00.000Z",
        "updatedAt": "2026-05-30T10:30:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "hasMore": false
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

#### 3. Obtener Restaurantes Cercanos
```bash
GET /api/v1/restaurants/nearby?latitude=-0.2202&longitude=-78.5124&maxKm=5
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "La Mejor Comida",
      "address": "Quito, Ecuador, Calle Principal 123",
      "latitude": -0.2202,
      "longitude": -78.5124,
      "distance": 0.5,
      "isOpen": true,
      "subscriptionActive": true
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Otro Restaurante",
      "address": "Quito, Ecuador, Avenida Principal 456",
      "latitude": -0.2210,
      "longitude": -78.5130,
      "distance": 1.2,
      "isOpen": false,
      "subscriptionActive": true
    }
  ],
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

#### 4. Obtener Detalle de Restaurante
```bash
GET /api/v1/restaurants/:id
Authorization: Bearer <token>
```

**Response (200):** (mismo que crear restaurante)

#### 5. Actualizar Restaurante
```bash
PUT /api/v1/restaurants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "description": "Nueva descripción"
}
```

**Response (200):** (mismo que crear restaurante actualizado)

---

### Menús

#### 6. Obtener Menú de Restaurante
```bash
GET /api/v1/restaurants/:id/menu-items?page=1&limit=50&category=Platos%20Principales&availableOnly=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `category` - Filtrar por categoría
- `availableOnly` (default: true) - Solo items disponibles
- `sortBy` (default: "name") - Ordenar por: name, price, createdAt

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Locro de Papa",
        "description": "Delicioso locro con carne y papas",
        "category": "Platos Principales",
        "price": 8.50,
        "imageUrl": "https://example.com/locro.jpg",
        "available": true,
        "preparationTimeMinutes": 15,
        "createdAt": "2026-05-30T10:30:00.000Z",
        "updatedAt": "2026-05-30T10:30:00.000Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Ceviche Ecuatoriano",
        "description": "Ceviche fresco con camarón",
        "category": "Entradas",
        "price": 6.00,
        "imageUrl": "https://example.com/ceviche.jpg",
        "available": true,
        "preparationTimeMinutes": 10,
        "createdAt": "2026-05-30T10:30:00.000Z",
        "updatedAt": "2026-05-30T10:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 50,
    "hasMore": false
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

#### 7. Crear Item de Menú
```bash
POST /api/v1/restaurants/:id/menu-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Locro de Papa",
  "description": "Delicioso locro con carne y papas",
  "category": "Platos Principales",
  "price": 8.50,
  "imageUrl": "https://example.com/locro.jpg",
  "available": true,
  "preparationTimeMinutes": 15
}
```

**Response (201):** (mismo que obtener menú, un item)

---

## 🧪 Ejemplos con curl

### Crear Restaurante
```bash
curl -X POST http://localhost:3000/api/v1/restaurants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "La Mejor Comida",
    "address": "Quito, Calle Principal 123",
    "latitude": -0.2202,
    "longitude": -78.5124,
    "openingTime": "11:00",
    "closingTime": "20:00",
    "phone": "+593987654321",
    "ruc": "1234567890123"
  }'
```

### Listar Cercanos (5 km)
```bash
curl http://localhost:3000/api/v1/restaurants/nearby \
  -H "Authorization: Bearer $TOKEN" \
  -G \
  -d latitude=-0.2202 \
  -d longitude=-78.5124 \
  -d maxKm=5
```

### Obtener Menú
```bash
curl "http://localhost:3000/api/v1/restaurants/550e8400-e29b-41d4-a716-446655440000/menu-items" \
  -H "Authorization: Bearer $TOKEN"
```

### Crear Item de Menú
```bash
curl -X POST "http://localhost:3000/api/v1/restaurants/550e8400-e29b-41d4-a716-446655440000/menu-items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Locro de Papa",
    "category": "Platos Principales",
    "price": 8.50,
    "preparationTimeMinutes": 15
  }'
```

---

## 🎯 Validaciones

### Restaurant RUC
- Exactamente 13 dígitos
- Único en el sistema
- Formato ecuatoriano

### Coordenadas Geográficas
- Latitud: -90 a 90
- Longitud: -180 a 180
- Usadas para cálculo Haversine

### Horarios
- Formato HH:mm (24 horas)
- Closing time > Opening time

### Precios
- Mínimo: $0.01
- Máximo: $9,999.99

### Distancia
- Cálculo: Haversine (preciso para cortas distancias)
- Radio máximo: 5 km
- Unidad: kilómetros

---

## 🗄️ Base de Datos

### Nuevas Tablas
- `restaurants` - Ya existe (SPRINT 1)
- `menu_items` - Ya existe (SPRINT 1)

### Nuevos Índices
```sql
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_restaurants_subscription_status ON restaurants(subscription_status);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_available ON menu_items(available);
```

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos creados | 15 |
| Líneas de código | ~2,200 |
| Entidades | 2 (Restaurant, MenuItem) |
| Servicios | 2 (RestaurantService, MenuItemService) |
| Controllers | 1 (RestaurantController) |
| DTOs | 4 (Create, Update, List, Response) |
| Endpoints | 7 |
| Validaciones Zod | 6 schemas |
| Funciones Haversine | 5 |

---

## ✅ Testing Checklist

- [ ] Crear restaurante con datos válidos
- [ ] Crear restaurante con RUC duplicado → Error 409
- [ ] Crear restaurante con coordenadas inválidas → Error 400
- [ ] Listar restaurantes sin filtros
- [ ] Listar restaurantes con búsqueda
- [ ] Listar restaurantes cercanos (5 km)
- [ ] Listar solo restaurantes abiertos ahora
- [ ] Obtener detalle de restaurante
- [ ] Actualizar restaurante (solo propietario)
- [ ] Intentar actualizar restaurante ajeno → Error 403
- [ ] Crear item de menú
- [ ] Obtener menú con filtro de categoría
- [ ] Obtener menú solo disponibles

---

## 🔄 Próximo: SPRINT 3

SPRINT 3 implementará:
- ReservationService (crear, confirmar, cancelar)
- Validación de horarios y disponibilidad
- Kitchen Dashboard para propietarios
- Real-time updates con Firestore listeners

---

**Estado:** ✅ SPRINT 2 Completado
**Fecha:** 2026-05-30
**Próximo paso:** SPRINT 3 - Reservaciones
