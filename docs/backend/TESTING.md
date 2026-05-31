# Testing - Backend API

Guía para probar los endpoints de la API localmente.

## Health Check

```bash
curl http://localhost:3000/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-05-30T10:30:00.000Z",
  "service": "almuerza-ya-backend"
}
```

---

## Autenticación

### 1. Signup (Registrar usuario)

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123456",
    "fullName": "Juan Pérez",
    "phone": "+593987654321",
    "role": "customer"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

### 2. Signin (Login)

```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123456"
  }'
```

**Response (200):** (mismo que Signup)

### 3. Get Current User

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "phone": "+593987654321",
    "role": "customer",
    "profileImageUrl": null,
    "isActive": true,
    "createdAt": "2026-05-30T10:30:00.000Z",
    "updatedAt": "2026-05-30T10:30:00.000Z"
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

### 4. Logout

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "timestamp": "2026-05-30T10:30:00.000Z"
}
```

---

## Errores Comunes

### Token Inválido
```
Status: 401
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authorization token is invalid"
  }
}
```

### Token Expirado
```
Status: 401
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Authorization token has expired"
  }
}
```

### Validación Fallida
```
Status: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "email",
          "message": "Email must be valid"
        }
      ]
    }
  }
}
```

### Email Ya Registrado
```
Status: 409
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email already registered"
  }
}
```

---

## Usando Postman / Insomnia

### 1. Crear colección "Almuerza Ya"

### 2. Crear variable de entorno
```
BASE_URL = http://localhost:3000
TOKEN = (vacío, se rellena después de signup)
```

### 3. Request: Signup

```
POST {{BASE_URL}}/api/v1/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123456",
  "fullName": "Test User",
  "role": "customer"
}
```

En el script de prueba post:
```javascript
const response = pm.response.json();
pm.environment.set("TOKEN", response.data.token);
```

### 4. Request: Get Me

```
GET {{BASE_URL}}/api/v1/auth/me
Authorization: Bearer {{TOKEN}}
```

---

## Base de Datos

Ver datos en SQLite:

```bash
sqlite3 ../../sqlite/almuerza-ya.db

sqlite> SELECT * FROM users LIMIT 5;
sqlite> SELECT * FROM migrations;
sqlite> .tables
```

---

## Próximos Tests (SPRINT 2)

- [ ] POST /api/v1/restaurants (crear restaurante)
- [ ] GET /api/v1/restaurants (listar con filtro distancia)
- [ ] GET /api/v1/menu-items (menú del restaurante)
- [ ] POST /api/v1/reservations (crear reserva)
