# GLOSSARY - Terminología Estándar

**Definiciones de términos usados en las especificaciones** | Almuerza Ya SDD

---

## A

### Access Token
Token JWT que autoriza solicitudes de API. Expira en 1 hora.

### Admin
Rol de usuario con permisos de sistema completo. Puede crear usuarios, restaurantes, verificar pagos.

### API (Application Programming Interface)
Interfaz que permite comunicación entre frontend (cliente) y backend (servidor).

### Axios
Librería HTTP usada en frontend para hacer requests al backend.

### Authorization
Verificar si un usuario tiene permiso para hacer una acción (vs. Authentication = verificar identidad).

---

## B

### Backend
Servidor que procesa la lógica de negocio. En este proyecto: NestJS + Express.

### Bearer Token
Mecanismo de autenticación HTTP. Formato: `Authorization: Bearer {token}`

### Bcryptjs
Librería para hashear contraseñas de forma segura.

### BDD (Behavior-Driven Development)
Enfoque donde tests describen el comportamiento esperado.

---

## C

### Callback
Función que se ejecuta cuando algo termina (ej: cargar datos).

### Carousel
Componente visual que muestra elementos uno después de otro.

### Cart
Carrito de compra virtual donde usuario agrega items antes de checkout.

### Chef
Rol de usuario que trabaja en la cocina y actualiza estado de órdenes.

### Checkout
Proceso de revisión y confirmación de una orden.

### CORS (Cross-Origin Resource Sharing)
Mecanismo que permite requests desde múltiples dominios.

### Create (POST)
Operación HTTP que crea un nuevo recurso.

---

## D

### DAO (Data Access Object)
Patrón de diseño que maneja acceso a base de datos.

### Daily Menu
Menú especial del día ofrecido por un restaurante.

### Data Transfer Object (DTO)
Objeto que estructura datos entre frontend y backend.

### Decorator
En NestJS: `@Get()`, `@Post()`, etc. Marcan funciones como rutas/handlers.

### Delete (DELETE)
Operación HTTP que elimina un recurso.

### Dependencies
Librerías/módulos que un proyecto necesita.

---

## E

### Endpoint
Una ruta API específica. Ej: `POST /api/v1/auth/signin`

### Entity
Objeto principal en la base de datos. Ej: User, Restaurant, Reservation.

### Error Code
Número HTTP que indica resultado de request (200, 404, 500, etc).

### Exception
Error lanzado cuando algo falla. Ej: `UnauthorizedException`, `NotFoundException`.

### E2E (End-to-End)
Tests que prueban flujos completos de usuario desde inicio a fin.

---

## F

### Feature
Funcionalidad completa de la app. Ej: "Hacer una orden", "Buscar restaurantes".

### Filter
Mecanismo para reducir resultados. Ej: filtrar restaurantes por distancia.

### Foreign Key
Referencia a otra tabla en base de datos.

### Frontend
Interfaz visual que ve el usuario. En este proyecto: React + Tailwind.

### Full Stack
Desarrollador que trabaja en frontend y backend.

---

## G

### Geolocation
Ubicación GPS del usuario (latitud/longitud).

### Geospatial Query
Query de base de datos que calcula distancias basadas en coordenadas.

### Guard
En NestJS: middleware que protege rutas. Ej: `JwtAuthGuard`.

### GUID/UUID
Identificador único universal. Ej: `550e8400-e29b-41d4-a716-446655440000`

---

## H

### Handler
Función que maneja una solicitud HTTP.

### Hash
Versión encriptada de una contraseña que no se puede revertir.

### Hook
En React: función que usa state/effects. Ej: `useState`, `useEffect`, `useAuth`.

### HTTP
Protocolo de comunicación web. Métodos: GET, POST, PATCH, DELETE.

---

## I

### Index
Optimización de base de datos para búsquedas rápidas.

### Inject
En NestJS: `@Inject()` introduce dependencias en servicios.

### Injectable
En NestJS: `@Injectable()` marca una clase como servicio que puede ser inyectado.

### Input Validation
Verificar que datos del usuario cumplan reglas (email válido, etc).

### Integration Test
Test que verifica que múltiples componentes funcionan juntos.

---

## J

### JWT (JSON Web Token)
Token que contiene información del usuario. Usado para autenticación.

---

## K

### Kanban
Sistema visual de columnas (Pending, Ready, Completed) para organizar trabajo.

### Kitchen
Área del restaurante donde se prepara comida.

---

## L

### Latency
Tiempo que tarda un request en completarse.

### Lazy Loading
Cargar datos solo cuando se necesitan.

### Locale
Idioma/región del usuario.

---

## M

### Manager
Rol de usuario que maneja un restaurante (puede ser igual a Owner en algunos casos).

### Middleware
Código que se ejecuta antes/después de un handler.

### Module
En NestJS: agrupa controllers, services, y providers relacionados.

### Mutation
Cambiar datos (POST, PATCH, DELETE). Opuesto: Query (GET).

---

## N

### NestJS
Framework backend para Node.js que usa TypeScript.

### Notification
Mensaje enviado al usuario (email, push, SMS).

---

## O

### Order
Sinónimo de Reservation. Pedido que hace un cliente.

### Owner
Rol de usuario que posee un restaurante.

---

## P

### Pagination
Dividir resultados en páginas. Ej: página 1 de 5.

### Payload
Datos enviados en el body de un request.

### Payment Proof
Evidencia (screenshot) de que usuario pagó.

### Permissions
Acciones que un usuario puede hacer.

### POS (Point of Sale)
Sistema de caja registradora para restaurantes.

### Postman
Herramienta para testear APIs manualmente.

### Prisma
ORM usado en este proyecto para acceder a base de datos.

### Provider
En NestJS: `@Injectable()` class que puede ser inyectada.

---

## Q

### QR Code
Código visual 2D que contiene información (usado para pagos).

### Query
En GraphQL/API: solicitud de datos (GET). En SQL: command a base de datos.

### Queue
Sistema de mensajes para procesamiento asincrónico.

---

## R

### RBAC (Role-Based Access Control)
Sistema de permisos basado en roles (CUSTOMER, OWNER, ADMIN).

### React
Librería frontend para crear interfaces visuales.

### Refactor
Mejorar código sin cambiar su comportamiento.

### Refresh Token
Token de larga duración (7 días) usado para obtener nuevos access tokens.

### Reservation
Pedido que hace un cliente. Sinónimo: Order.

### REST
Estilo de arquitectura para APIs usando HTTP methods.

### Role
Tipo de usuario. Ej: CUSTOMER, RESTAURANT_OWNER, ADMIN.

---

## S

### Schema
Estructura de una tabla en base de datos.

### SDD (Spec-Driven Development)
Metodología donde specs se escriben antes del código.

### Seed
Datos de prueba iniciales en la base de datos.

### Service
Clase que contiene lógica de negocio.

### SPA (Single Page Application)
App web que carga una sola página HTML y actualiza dinámicamente.

### SQL
Lenguaje para consultar base de datos.

### State
Datos que un componente React mantiene y puede cambiar.

### Status Code
Número HTTP que indica resultado. Ej: 200 (OK), 404 (Not Found).

### Store
En Zustand: contenedor global de estado.

---

## T

### Test
Código que verifica que la implementación es correcta.

### Timestamp
Fecha y hora de cuándo algo pasó.

### Token
String que autoriza solicitudes autenticadas.

### TDD (Test-Driven Development)
Escribir tests antes del código.

### TypeScript
Lenguaje que agrega tipos a JavaScript.

---

## U

### UI (User Interface)
Interfaz visual que ve el usuario.

### Unit Test
Test de una función/componente en aislamiento.

### UUID
Identificador único universal de 36 caracteres.

### Update (PATCH)
Operación HTTP que modifica un recurso.

---

## V

### Validation
Verificar que datos cumplen requisitos.

### Vitest
Framework de testing para JavaScript/TypeScript.

---

## W

### Webhook
URL que se llama automáticamente cuando algo sucede.

---

## Z

### Zod
Librería para validación de datos/schemas en JavaScript.

### Zustand
Librería para state management en React (más ligera que Redux).

---

## API Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Request exitoso |
| 201 | Created | Recurso creado |
| 204 | No Content | Deleted exitoso, sin body |
| 400 | Bad Request | Input inválido |
| 401 | Unauthorized | Sin token o token inválido |
| 403 | Forbidden | No tiene permiso |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Dato duplicado, estado inválido |
| 422 | Validation Error | Validación de datos falló |
| 500 | Server Error | Error interno del servidor |

---

## Database Terms

| Term | Meaning |
|------|---------|
| PK (Primary Key) | Identificador único de una row |
| FK (Foreign Key) | Referencia a otra tabla |
| Null | Sin valor asignado |
| Unique | Valor no puede repetirse en tabla |
| Index | Optimización para búsquedas rápidas |
| Schema | Estructura de las tablas |
| Migration | Script que modifica estructura DB |
| Seed | Datos iniciales para testing |
| Soft Delete | Marcar como deletado (deletedAt) sin borrar |
| Hard Delete | Borrar completamente de DB |

---

## User Roles

### CUSTOMER
- Busca restaurantes
- Hace órdenes
- Paga
- Rastraea órdenes

### RESTAURANT_OWNER
- Crea/edita restaurante
- Manage menú
- Confirm órdenes
- Ver pagos

### STAFF/CHEF/MANAGER
- Confirm órdenes
- Update estado
- Rastraea orden

### ADMIN
- Todo acceso
- Verifica pagos
- Manage usuarios
- Sistema reports

---

## HTTP Methods

| Method | Purpose | Safe | Idempotent |
|--------|---------|------|-----------|
| GET | Leer datos | Sí | Sí |
| POST | Crear recurso | No | No |
| PATCH | Modificar recurso | No | Sí |
| DELETE | Eliminar recurso | No | Sí |

---

## Acronyms

| Acronym | Full Form |
|---------|-----------|
| API | Application Programming Interface |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
| CORS | Cross-Origin Resource Sharing |
| ORM | Object-Relational Mapping |
| DAO | Data Access Object |
| DTO | Data Transfer Object |
| SPA | Single Page Application |
| TDD | Test-Driven Development |
| BDD | Behavior-Driven Development |
| SDD | Spec-Driven Development |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HTTP Secure |
| SQL | Structured Query Language |
| UUID | Universally Unique Identifier |
| E2E | End-to-End |
| DB | Database |
| API | Application Programming Interface |
| POS | Point of Sale |

---

**Última actualización**: 2025-02-05
**Versión**: 1.0

Si encuentras un término que no está aquí, ¡agrega uno!
