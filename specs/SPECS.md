# SPECIFICATIONS: ALMUERZA YA - Spec-Driven Development

**Documento Maestro de Especificaciones** | Última actualización: 2025-02-05 | Status: Production-Ready

---

## TABLA DE CONTENIDOS

1. [API REST Specifications](#1-api-rest-specifications)
2. [Service Layer Specifications](#2-service-layer-specifications)
3. [Component Specifications (React)](#3-component-specifications-react)
4. [Store Specifications (Zustand)](#4-store-specifications-zustand)
5. [Database Schema Specifications](#5-database-schema-specifications)
6. [E2E User Flows](#6-e2e-user-flows)
7. [Error Handling Specifications](#7-error-handling-specifications)
8. [Security & Auth Specifications](#8-security--auth-specifications)

---

# 1. API REST SPECIFICATIONS

## 1.1 Auth Endpoints

### `POST /api/v1/auth/signup`
**Purpose**: Register new user

**Request Body**:
```typescript
{
  email: string;              // Required. email format validation
  password: string;           // Required. min 8 chars, 1 uppercase, 1 number, 1 symbol
  firstName: string;          // Required. 2-50 chars
  lastName: string;           // Required. 2-50 chars
  phone?: string;             // Optional. E164 format
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER';  // Default: 'CUSTOMER'
}
```

**Response (201 Created)**:
```typescript
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken?: string;
}
```

**Error Cases**:
- `409 Conflict`: Email already exists
- `400 Bad Request`: Invalid email format, weak password, missing fields
- `422 Unprocessable Entity`: Validation errors (Zod)

**Implementation Notes**:
- Hash password with bcryptjs (10 salt rounds)
- Create JWT access token (1 hour expiration)
- Create JWT refresh token (7 days expiration)
- Store refresh token in DB
- Return both tokens

---

### `POST /api/v1/auth/signin`
**Purpose**: Login with email & password

**Request Body**:
```typescript
{
  email: string;      // Required
  password: string;   // Required
}
```

**Response (200 OK)**:
```typescript
{
  user: User;
  accessToken: string;
  refreshToken?: string;
}
```

**Error Cases**:
- `401 Unauthorized`: Email not found or password incorrect
- `400 Bad Request`: Missing email or password

**Implementation Notes**:
- Find user by email (case-insensitive)
- Compare plaintext password with bcryptjs hash
- Generate new tokens
- Invalidate previous refresh tokens

---

### `POST /api/v1/auth/refresh`
**Purpose**: Refresh access token

**Request Header**:
```
Authorization: Bearer {refreshToken}
```

**Response (200 OK)**:
```typescript
{
  accessToken: string;
  refreshToken?: string;
}
```

**Error Cases**:
- `401 Unauthorized`: Invalid or expired refresh token
- `403 Forbidden`: Refresh token not found in DB

---

### `GET /api/v1/auth/me`
**Purpose**: Get current authenticated user

**Guards**: JwtAuthGuard (required)

**Response (200 OK)**:
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  restaurantRoles?: Array<{
    restaurantId: string;
    restaurantName: string;
    role: 'OWNER' | 'MANAGER' | 'CHEF' | 'STAFF';
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**Error Cases**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User deleted

---

### `POST /api/v1/auth/logout`
**Purpose**: Logout (invalidate tokens)

**Guards**: JwtAuthGuard (required)

**Response (200 OK)**:
```typescript
{ message: "Logged out successfully" }
```

**Implementation Notes**:
- Delete refresh token from DB
- Frontend clears token from localStorage & Zustand

---

## 1.2 Restaurant Endpoints

### `GET /api/v1/restaurants`
**Purpose**: Get all restaurants (paginated)

**Query Parameters**:
```typescript
page?: number;        // Default: 1
limit?: number;       // Default: 10, Max: 50
search?: string;      // Filter by name (case-insensitive)
sortBy?: 'name' | 'createdAt' | 'distance';  // Default: 'name'
order?: 'asc' | 'desc';  // Default: 'asc'
```

**Response (200 OK)**:
```typescript
{
  data: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

---

### `GET /api/v1/restaurants/nearby`
**Purpose**: Get nearby restaurants by geolocation

**Query Parameters**:
```typescript
latitude: number;     // Required. User's latitude
longitude: number;    // Required. User's longitude
maxKm?: number;       // Default: 5. Search radius in km
limit?: number;       // Default: 20
```

**Response (200 OK)**:
```typescript
{
  data: Array<{
    ...Restaurant;
    distance: number;  // Distance in km from user's location
    bearing: number;   // Direction (0-360 degrees)
  }>;
  center: { latitude: number; longitude: number };
}
```

**Error Cases**:
- `400 Bad Request`: Invalid latitude/longitude

**Implementation Notes**:
- Use PostgreSQL PostGIS extension (`ST_Distance`)
- Calculate distance between user point and restaurant point
- Sort by distance ascending
- Exclude deleted restaurants

---

### `GET /api/v1/restaurants/:id`
**Purpose**: Get restaurant by ID with full details

**Response (200 OK)**:
```typescript
{
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  isOpen: boolean;
  openingTime?: string;  // HH:MM format
  closingTime?: string;  // HH:MM format
  menuItems: MenuItem[];
  dailyMenus: DailyMenu[];
  createdAt: string;
  updatedAt: string;
}
```

**Error Cases**:
- `404 Not Found`: Restaurant not found or deleted

---

### `GET /api/v1/restaurants/mine/my-restaurant`
**Purpose**: Get restaurant owned by authenticated user

**Guards**: JwtAuthGuard (required)

**Response (200 OK)**:
```typescript
Restaurant;
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User is not a restaurant owner

---

### `POST /api/v1/restaurants`
**Purpose**: Create new restaurant

**Guards**: JwtAuthGuard (required), Role must be RESTAURANT_OWNER

**Request Body**:
```typescript
{
  name: string;              // Required. 2-100 chars. Unique
  address: string;           // Required. 5-200 chars
  phone: string;             // Required. E164 format
  email?: string;            // Optional. Email format
  latitude: number;          // Required. -90 to 90
  longitude: number;         // Required. -180 to 180
  description?: string;      // Optional. Max 500 chars
  imageUrl?: string;         // Optional. Valid image URL
  basePrice?: number;        // Default: 5.0. Min: 0.01
  openingTime?: string;      // HH:MM format
  closingTime?: string;      // HH:MM format
  bankAccount?: string;      // Optional. For DeUna transfers
}
```

**Response (201 Created)**:
```typescript
Restaurant;
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User role is not RESTAURANT_OWNER
- `400 Bad Request`: Validation errors
- `409 Conflict`: Restaurant name already exists

**Implementation Notes**:
- Create UserRestaurant record with role='OWNER'
- Validate coordinates are within Ecuador bounds
- Set `isOpen=true` by default

---

### `PATCH /api/v1/restaurants/:id`
**Purpose**: Update restaurant details

**Guards**: JwtAuthGuard (required), Must be restaurant owner

**Request Body**: (Partial - all fields optional)
```typescript
{
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  imageUrl?: string;
  basePrice?: number;
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  bankAccount?: string;
}
```

**Response (200 OK)**:
```typescript
Restaurant;
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User is not owner of this restaurant
- `404 Not Found`: Restaurant not found
- `409 Conflict`: New name conflicts with another restaurant

---

### `DELETE /api/v1/restaurants/:id`
**Purpose**: Delete restaurant (soft delete)

**Guards**: JwtAuthGuard (required), Must be owner

**Response (204 No Content)**

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Restaurant not found

**Implementation Notes**:
- Set `deletedAt = NOW()` (soft delete)
- Cascade to associated menu items, daily menus, orders

---

## 1.3 Menu Item Endpoints

### `GET /api/v1/menu-items/restaurant/:restaurantId`
**Purpose**: Get all menu items for a restaurant

**Query Parameters**:
```typescript
page?: number;      // Default: 1
limit?: number;     // Default: 20
category?: string;  // Filter by category
onlyAvailable?: boolean;  // Default: false
```

**Response (200 OK)**:
```typescript
{
  data: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

### `GET /api/v1/menu-items/:id`
**Purpose**: Get menu item by ID

**Response (200 OK)**:
```typescript
MenuItem;
```

**Error Cases**:
- `404 Not Found`: Menu item not found

---

### `POST /api/v1/menu-items`
**Purpose**: Create menu item for restaurant

**Guards**: JwtAuthGuard (required), Must be restaurant owner

**Request Body**:
```typescript
{
  restaurantId: string;      // Required
  name: string;              // Required. 2-100 chars
  description?: string;      // Optional. Max 500 chars
  price: number;             // Required. Min: 0.01
  category: string;          // Required. 'Sopa' | 'Segundo' | 'Bebida' | 'Postre' | 'Entrada' | 'Extras'
  imageUrl?: string;         // Optional. Valid image URL
  available?: boolean;       // Default: true
}
```

**Response (201 Created)**:
```typescript
MenuItem;
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not restaurant owner
- `404 Not Found`: Restaurant not found

---

### `PATCH /api/v1/menu-items/:id`
**Purpose**: Update menu item

**Guards**: JwtAuthGuard (required), Must be restaurant owner

**Request Body**: (Partial)
```typescript
{
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
}
```

**Response (200 OK)**:
```typescript
MenuItem;
```

---

### `DELETE /api/v1/menu-items/:id`
**Purpose**: Delete menu item (soft delete)

**Guards**: JwtAuthGuard (required)

**Response (204 No Content)**

**Error Cases**:
- `403 Forbidden`: Not authorized

---

## 1.4 Daily Menu Endpoints

### `POST /api/v1/daily-menus`
**Purpose**: Create daily menu

**Guards**: JwtAuthGuard (required), Must be restaurant owner

**Request Body**:
```typescript
{
  restaurantId: string;      // Required
  nombre: string;            // Required. Daily menu name
  imagen?: string;           // Optional. Image URL
  price?: number;            // Default: 5.0
  sopaName: string;          // Required. Soup name
  sopaExtras?: string;       // Optional
  proteinaName: string;      // Required. Protein/main dish
  guarniciones?: string;     // Optional. Side dishes
  ensalada?: string;         // Optional. Salad
  bebida?: string;           // Optional. Beverage
  postre?: string;           // Optional. Dessert
  isActive?: boolean;        // Default: false
  date?: string;             // ISO date. Default: today
}
```

**Response (201 Created)**:
```typescript
DailyMenu;
```

---

### `GET /api/v1/daily-menus/:restaurantId`
**Purpose**: Get daily menus for restaurant

**Query Parameters**:
```typescript
date?: string;              // ISO date. Default: today
limit?: number;             // Default: 7
onlyActive?: boolean;       // Default: false
```

**Response (200 OK)**:
```typescript
{
  data: DailyMenu[];
  restaurant: Restaurant;
}
```

---

### `GET /api/v1/daily-menus/:id/detail`
**Purpose**: Get daily menu with full details

**Response (200 OK)**:
```typescript
DailyMenu;
```

---

### `PUT /api/v1/daily-menus/:id`
**Purpose**: Update daily menu

**Guards**: JwtAuthGuard (required), Must be owner

**Request Body**: (Partial)
```typescript
{
  nombre?: string;
  precio?: number;
  sopaName?: string;
  sopaExtras?: string;
  // ... other fields
}
```

**Response (200 OK)**:
```typescript
DailyMenu;
```

---

### `PUT /api/v1/daily-menus/:id/activate`
**Purpose**: Activate or deactivate daily menu

**Guards**: JwtAuthGuard (required)

**Request Body**:
```typescript
{
  isActive: boolean;
}
```

**Response (200 OK)**:
```typescript
DailyMenu;
```

**Implementation Notes**:
- Set `isActive` flag
- Send notification to customers if activated

---

### `DELETE /api/v1/daily-menus/:id`
**Purpose**: Delete daily menu (soft delete)

**Guards**: JwtAuthGuard (required)

**Response (204 No Content)**

---

## 1.5 Reservation Endpoints

### `POST /api/v1/reservations`
**Purpose**: Create reservation (order)

**Guards**: JwtAuthGuard (required)

**Request Body**:
```typescript
{
  restaurantId: string;      // Required
  reservationDate: string;   // Required. ISO date (YYYY-MM-DD)
  reservationTime: string;   // Required. HH:MM format
  partySize: number;         // Required. 1-50
  specialRequests?: string;  // Optional. Max 500 chars
  items: Array<{
    menuItemId: string;      // Required
    quantity: number;        // Required. Min: 1
  }>;
}
```

**Response (201 Created)**:
```typescript
{
  id: string;
  reservationCode: string;   // Human-readable code (e.g., "AY-2025-001234")
  userId: string;
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
  status: 'PENDING';
  items: ReservationItem[];
  totalAmount: number;
  createdAt: string;
}
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Restaurant or menu item not found
- `400 Bad Request`: Invalid date/time, menu item not available
- `409 Conflict`: Restaurant closed at requested time

**Implementation Notes**:
- Generate unique `reservationCode`
- Calculate `totalAmount` = sum of (menuItem.price * quantity)
- Validate restaurant is open at requested time
- Create ReservationItem records
- Set status='PENDING'
- Send confirmation email to customer & restaurant

---

### `GET /api/v1/reservations`
**Purpose**: Get user's reservations

**Guards**: JwtAuthGuard (required)

**Query Parameters**:
```typescript
status?: string;            // Filter by status
page?: number;              // Default: 1
limit?: number;             // Default: 10
```

**Response (200 OK)**:
```typescript
{
  data: Reservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

### `GET /api/v1/reservations/:id`
**Purpose**: Get reservation by ID

**Response (200 OK)**:
```typescript
Reservation;
```

---

### `GET /api/v1/reservations/available-slots/:restaurantId`
**Purpose**: Get available time slots for restaurant

**Query Parameters**:
```typescript
date: string;               // Required. ISO date
partySize?: number;         // Default: 1
```

**Response (200 OK)**:
```typescript
{
  date: string;
  availableSlots: Array<{
    time: string;          // HH:MM format
    available: boolean;
    capacity: number;      // Remaining capacity
  }>;
}
```

**Implementation Notes**:
- Generate 30-minute slots between opening & closing times
- Subtract existing reservations from capacity
- Return only slots with available capacity

---

### `PATCH /api/v1/reservations/:id/confirm`
**Purpose**: Confirm reservation (restaurant action)

**Guards**: JwtAuthGuard (required), Must be restaurant staff

**Response (200 OK)**:
```typescript
{
  ...Reservation;
  status: 'CONFIRMED';
  confirmedAt: string;
}
```

**Implementation Notes**:
- Send notification to customer
- Update status='CONFIRMED'
- Set `confirmedAt=NOW()`

---

### `PATCH /api/v1/reservations/:id/cancel`
**Purpose**: Cancel reservation

**Guards**: JwtAuthGuard (required), Must be customer or restaurant owner

**Request Body**:
```typescript
{
  reason?: string;
}
```

**Response (200 OK)**:
```typescript
{
  ...Reservation;
  status: 'CANCELLED';
  canceledAt: string;
}
```

**Implementation Notes**:
- Set status='CANCELLED'
- Set `canceledAt=NOW()`
- Refund payment if already paid
- Send notification email

---

## 1.6 Payment Endpoints

### `POST /api/v1/payments`
**Purpose**: Create payment for reservation

**Guards**: JwtAuthGuard (required)

**Request Body**:
```typescript
{
  reservationId: string;     // Required
  method: 'PICHINCHA_QR' | 'TRANSFER' | 'CASH' | 'CARD';  // Required
  // For PICHINCHA_QR:
  // Backend generates QR code with amount
}
```

**Response (201 Created)**:
```typescript
{
  id: string;
  paymentCode: string;       // Unique payment code
  reservationId: string;
  amount: number;
  currency: 'USD';
  status: 'PENDING';
  method: string;
  qrCode?: string;           // Base64 encoded QR (for PICHINCHA)
  qrExpiry?: string;         // QR expiration timestamp
  createdAt: string;
}
```

**Error Cases**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Reservation not found
- `409 Conflict`: Payment already exists for reservation

---

### `GET /api/v1/payments/:id`
**Purpose**: Get payment by ID

**Response (200 OK)**:
```typescript
Payment;
```

---

### `POST /api/v1/payments/:id/upload-proof`
**Purpose**: Upload payment proof (receipt/screenshot)

**Guards**: JwtAuthGuard (required)

**Request**:
```
Content-Type: multipart/form-data
- file: File (image/jpeg, image/png, max 5MB)
```

**Response (200 OK)**:
```typescript
{
  ...Payment;
  proofUrl: string;
  status: 'AWAITING_PROOF';
}
```

**Error Cases**:
- `400 Bad Request`: Invalid file format or size
- `413 Payload Too Large`: File exceeds 5MB

**Implementation Notes**:
- Store proof in object storage (MinIO/S3)
- Generate signed URL valid for 7 days
- Send admin notification for review

---

### `PATCH /api/v1/payments/:id/verify`
**Purpose**: Verify payment (admin action)

**Guards**: JwtAuthGuard (required), Must be admin/restaurant

**Request Body**:
```typescript
{
  verified: boolean;
  notes?: string;
}
```

**Response (200 OK)**:
```typescript
{
  ...Payment;
  status: 'VERIFIED' | 'REJECTED';
  proofVerifiedAt: string;
  notes?: string;
}
```

**Implementation Notes**:
- If verified: status='VERIFIED', trigger reservation confirmation
- If rejected: status='REJECTED', notify customer to resubmit
- Update `proofVerifiedAt`

---

### `PATCH /api/v1/payments/:id/complete`
**Purpose**: Mark payment as complete

**Guards**: JwtAuthGuard (required), Must be admin

**Response (200 OK)**:
```typescript
{
  ...Payment;
  status: 'COMPLETED';
  completedAt: string;
}
```

---

---

# 2. SERVICE LAYER SPECIFICATIONS

## 2.1 Auth Service

### `signup(email, password, firstName, lastName, phone?, role?): Promise<AuthResponse>`

**Preconditions**:
- Email must not exist in DB
- Password must meet security requirements (8+ chars, 1 upper, 1 digit, 1 symbol)

**Process**:
1. Validate input with Zod schema
2. Hash password with bcryptjs (10 rounds)
3. Create user record in DB
4. Generate JWT tokens
5. Return user + tokens

**Postconditions**:
- User record created with `role` and timestamps
- Tokens stored in response
- User can now login

**Error Handling**:
- Throw `ConflictException` if email exists
- Throw `BadRequestException` for validation errors

---

### `signin(email, password): Promise<AuthResponse>`

**Preconditions**:
- User must exist with email

**Process**:
1. Find user by email (case-insensitive)
2. Compare password with stored hash (bcryptjs)
3. If match: generate tokens, store refresh token in DB, return tokens
4. If no match: throw 401 error

**Postconditions**:
- Refresh token stored in DB
- Access token expires in 1 hour
- Refresh token expires in 7 days

**Error Handling**:
- Throw `UnauthorizedException` if email not found or password mismatch

---

### `refreshTokens(refreshToken): Promise<{accessToken, refreshToken?}>`

**Preconditions**:
- Refresh token must exist in DB
- Token must not be expired
- Token must be valid JWT

**Process**:
1. Verify JWT signature
2. Find token in DB
3. Generate new access token
4. Optionally generate new refresh token (rotation)
5. Update DB with new refresh token (if rotating)

**Error Handling**:
- Throw `UnauthorizedException` if token invalid or expired
- Throw `ForbiddenException` if token not in DB

---

### `getCurrentUser(userId): Promise<User>`

**Process**:
1. Find user by ID
2. Include restaurantRoles if applicable
3. Return user record

**Error Handling**:
- Throw `NotFoundException` if user deleted

---

### `logout(userId): Promise<void>`

**Process**:
1. Delete refresh token from DB
2. Clear any session data

**Postconditions**:
- Frontend must clear localStorage token
- Subsequent requests with old token will fail

---

## 2.2 Restaurant Service

### `findAll(page, limit, search?, sortBy?, order?): Promise<PaginatedResponse<Restaurant>>`

**Filter**:
- `search`: Case-insensitive partial match on `name` or `address`
- Exclude soft-deleted restaurants (`deletedAt IS NULL`)

**Sort**:
- `name`: Alphabetically
- `createdAt`: By creation date
- `distance`: By geolocation (requires latitude/longitude in query)

**Response**: Paginated restaurant array

**Error Handling**:
- Handle invalid page/limit (set defaults)

---

### `findNearby(latitude, longitude, maxKm?, limit?): Promise<Restaurant[]>`

**Geolocation**:
- Use PostGIS `ST_Distance(point1, point2)` to calculate distance
- Filter restaurants within `maxKm` radius
- Calculate bearing (direction) from user to restaurant
- Sort by distance ascending
- Limit results

**Prerequisites**:
- PostgreSQL with PostGIS extension enabled
- Restaurant coordinates must be valid

**Error Handling**:
- Throw `BadRequestException` if coordinates invalid

---

### `findById(id): Promise<Restaurant>`

**Preconditions**:
- Restaurant must exist and not be soft-deleted

**Includes**:
- Menu items
- Daily menus (active only)
- Operating hours

**Error Handling**:
- Throw `NotFoundException` if not found

---

### `findByUserId(userId): Promise<Restaurant>`

**Process**:
1. Find user's restaurants via UserRestaurant (role='OWNER')
2. Return first restaurant if exists
3. Otherwise throw 404

**Error Handling**:
- Throw `NotFoundException` if user has no restaurant

---

### `create(data, userId): Promise<Restaurant>`

**Preconditions**:
- User must have RESTAURANT_OWNER role
- Restaurant name must be unique
- Coordinates must be valid (within Ecuador bounds)

**Process**:
1. Validate input
2. Create Restaurant record
3. Create UserRestaurant record (role='OWNER', userId)
4. Return created restaurant

**Postconditions**:
- Restaurant `isOpen=true` by default
- User is assigned as owner
- Can start adding menu items

**Error Handling**:
- Throw `ConflictException` if name duplicate
- Throw `BadRequestException` for invalid coordinates

---

### `update(id, data, userId): Promise<Restaurant>`

**Authorization**:
- User must be restaurant owner or admin

**Process**:
1. Find restaurant
2. Validate authorization
3. Update fields
4. Return updated record

**Error Handling**:
- Throw `ForbiddenException` if not authorized
- Throw `NotFoundException` if restaurant not found

---

### `delete(id, userId): Promise<void>`

**Authorization**:
- User must be owner

**Process**:
1. Soft delete: set `deletedAt = NOW()`
2. Cascade soft delete to:
   - Menu items
   - Daily menus
   - Reservations (cancel all pending)
   - Payments (cancel all pending)

**Postconditions**:
- Restaurant is hidden from queries
- Data is retained for audit trail

---

## 2.3 Daily Menu Service

### `create(data, userId): Promise<DailyMenu>`

**Preconditions**:
- User must be restaurant owner
- Restaurant must exist

**Process**:
1. Validate input
2. Create DailyMenu record
3. Set `isActive=false` initially
4. Default date=TODAY if not provided
5. Default price=5.0 USD if not provided

**Postconditions**:
- Daily menu created
- Ready to be activated by owner

---

### `findByRestaurant(restaurantId, date?, limit?): Promise<DailyMenu[]>`

**Preconditions**:
- Restaurant must exist

**Filter**:
- `date`: Default to today
- `limit`: Default 7 (next 7 days)
- `isActive`: Include only active if `onlyActive=true`

**Sort**: By date ascending

**Process**:
1. Query menus for date range
2. Exclude soft-deleted
3. Return results

---

### `findById(id): Promise<DailyMenu>`

**Error Handling**:
- Throw `NotFoundException` if not found

---

### `update(id, data, userId): Promise<DailyMenu>`

**Authorization**:
- User must be restaurant owner

**Process**:
1. Find menu
2. Validate authorization
3. Update fields
4. Return updated menu

---

### `activate(id, isActive, userId): Promise<DailyMenu>`

**Authorization**:
- User must be restaurant owner

**Process**:
1. Toggle `isActive` flag
2. If activating: send notification to customers
3. Return updated menu

---

### `delete(id, userId): Promise<void>`

**Process**:
1. Soft delete: set `deletedAt=NOW()`

---

## 2.4 Reservation Service

### `create(data, userId): Promise<Reservation>`

**Preconditions**:
- User must be authenticated
- Restaurant must exist
- Menu items must exist and be available
- Reservation time must be within operating hours
- Party size: 1-50

**Process**:
1. Validate all inputs
2. Check restaurant is open at requested time
3. Check menu items available
4. Calculate total amount
5. Create Reservation record
6. Create ReservationItem records for each item
7. Generate unique `reservationCode` (format: AY-YYYY-XXXXXX)
8. Send confirmation email to customer
9. Send notification to restaurant
10. Return reservation

**Postconditions**:
- Reservation status='PENDING'
- Ready for payment
- Items reserved (not deducted from inventory)

**Error Handling**:
- Throw `BadRequestException` if validation fails
- Throw `ConflictException` if restaurant closed

---

### `getByUser(userId, page?, limit?): Promise<PaginatedResponse<Reservation>>`

**Filter**:
- Only reservations created by user
- Optionally filter by status

**Sort**: By createdAt descending (newest first)

**Includes**:
- Items
- Restaurant details
- Payment info

---

### `getById(id): Promise<Reservation>`

**Includes**:
- Items with menu item details
- Restaurant info
- Payment info

---

### `getAvailableSlots(restaurantId, date, partySize?): Promise<TimeSlot[]>`

**Process**:
1. Get restaurant opening/closing times
2. Generate 30-minute slots
3. Query existing reservations for date
4. Calculate remaining capacity (subtract confirmed reservations)
5. Filter only slots with capacity >= partySize
6. Return available slots

**Response Format**:
```typescript
[
  { time: '11:00', available: true, capacity: 5 },
  { time: '11:30', available: true, capacity: 3 },
  { time: '12:00', available: false, capacity: 0 },
  ...
]
```

---

### `confirm(id, userId): Promise<Reservation>`

**Authorization**:
- User must be restaurant owner/staff or admin

**Process**:
1. Find reservation
2. Validate authorization
3. Check still PENDING status
4. Set status='CONFIRMED'
5. Set `confirmedAt=NOW()`
6. Send notification to customer
7. Return confirmation

**Error Handling**:
- Throw `ForbiddenException` if not authorized
- Throw `ConflictException` if not PENDING

---

### `cancel(id, userId, reason?): Promise<Reservation>`

**Authorization**:
- User must be customer (owner) OR restaurant owner/admin

**Process**:
1. Find reservation
2. Validate authorization
3. Set status='CANCELLED'
4. Set `canceledAt=NOW()`
5. If payment exists: trigger refund process
6. Send notification to both parties
7. Return cancelled reservation

**Error Handling**:
- Throw `ForbiddenException` if not authorized
- Throw `ConflictException` if already completed

---

## 2.5 Payment Service

### `create(reservationId, method, userId): Promise<Payment>`

**Preconditions**:
- Reservation must exist and be PENDING/CONFIRMED
- Payment must not already exist for reservation

**Process**:
1. Find reservation
2. Validate authorization (user = reservation owner)
3. Create Payment record with status='PENDING'
4. If method='PICHINCHA_QR':
   - Generate QR code with amount
   - Set QR expiry to 15 minutes
   - Return QR code in response
5. Return payment

**Postconditions**:
- Payment created and ready for customer to pay
- QR code generated (if applicable)

**Error Handling**:
- Throw `ConflictException` if payment exists
- Throw `NotFoundException` if reservation not found

---

### `uploadProof(paymentId, file, userId): Promise<Payment>`

**Preconditions**:
- File must be image (jpg, png)
- File size max 5MB
- Payment must exist and be PENDING

**Process**:
1. Validate file
2. Upload to object storage (MinIO)
3. Get signed URL
4. Update Payment with proof URL
5. Set status='AWAITING_PROOF'
6. Send notification to admin
7. Return payment

**Postconditions**:
- Proof stored and accessible
- Admin notified for manual verification

---

### `verify(paymentId, verified, notes?, userId): Promise<Payment>`

**Authorization**:
- User must be admin or restaurant owner

**Process**:
- If `verified=true`:
  1. Set status='VERIFIED'
  2. Set `proofVerifiedAt=NOW()`
  3. Auto-confirm associated reservation
  4. Send notification to customer
- If `verified=false`:
  1. Set status='REJECTED'
  2. Add notes
  3. Send rejection notification to customer

**Postconditions**:
- Payment status updated
- Reservation confirmed if verified
- Customer notified

---

### `complete(paymentId, userId): Promise<Payment>`

**Authorization**:
- User must be admin

**Process**:
1. Find payment
2. Validate is VERIFIED
3. Set status='COMPLETED'
4. Set `completedAt=NOW()`
5. Update associated reservation to READY_FOR_PICKUP
6. Return payment

**Error Handling**:
- Throw `ConflictException` if not VERIFIED

---

---

# 3. COMPONENT SPECIFICATIONS (React)

## 3.1 Pages

### Login Page (`pages/Login.tsx`)

**Functionality**:
- Display login form
- Validate email & password
- Call `authService.signin()`
- Handle errors (invalid credentials, network error)
- On success: save token to Zustand + localStorage, redirect to Home

**Component Props**: None (uses hooks)

**Custom Hooks Used**:
- `useAuth()` - authStore for login method

**State Management**:
- Form state: React Hook Form
- Auth state: Zustand (authStore)

**UI Components**:
- Input (email, password)
- Button (submit)
- Alert (errors)

**Validation**:
- Email: valid format
- Password: not empty

**Error Handling**:
- Display error message from API
- Show network error
- Handle 401 Unauthorized

**Redirect Logic**:
- On success: navigate to `/` (Home)
- If already logged in: redirect to Home immediately

---

### Signup Page (`pages/Signup.tsx`)

**Functionality**:
- Display signup form
- Collect: email, password, firstName, lastName, phone (optional), role
- Validate all inputs
- Call `authService.signup()`
- On success: auto-login and redirect to Home

**Form Fields**:
- email: email input
- password: password input (strength indicator)
- confirmPassword: password input
- firstName: text input
- lastName: text input
- phone: tel input (optional)
- role: select (CUSTOMER / RESTAURANT_OWNER)

**Validation**:
- Email: valid format, unique
- Password: 8+ chars, 1 upper, 1 digit, 1 symbol
- Password confirmation: must match
- Name: 2-50 chars
- Phone: optional, E164 format

**Error Handling**:
- Show field-level validation errors
- Show API errors (email exists, etc.)
- Display password strength feedback

---

### Home Page (`pages/Home.tsx`)

**Functionality**:
- Display nearby restaurants
- Search restaurants by name
- Filter by category
- Show map (optional)
- User geolocation (request permission)

**Data Fetching**:
- On mount: request geolocation
- `restaurantStore.fetchNearbyRestaurants(lat, lng)`

**State Management**:
- restaurantStore: restaurants, loading, error
- Local state: search query, filters

**Components Used**:
- RestaurantList
- RestaurantCard
- Map (optional)
- Search input
- Geolocation prompt

**User Interactions**:
- Search by name
- Filter by distance
- Click card to view details
- Pull-to-refresh (mobile)

---

### Restaurant Detail Page (`pages/RestaurantDetail.tsx`)

**Functionality**:
- Display restaurant details
- Show menu items
- Show daily menu (if available)
- Show reviews/ratings
- Add items to cart

**Route Param**: `restaurantId`

**Data Fetching**:
- `restaurantService.getById(restaurantId)`
- `menuItemService.findByRestaurant(restaurantId)`
- `dailyMenuService.findByRestaurant(restaurantId)`

**Components Used**:
- Restaurant header (image, name, address, hours)
- Menu items list
- Daily menu section
- Add to cart button
- Cart summary

**State Management**:
- cartStore: add/update items
- Local state: selected items, quantity

**User Interactions**:
- View menu items by category
- Add items to cart
- Change quantity
- Proceed to checkout

---

### Checkout Page (`pages/Checkout.tsx`)

**Functionality**:
- Display cart items & total
- Collect reservation details (date, time, party size, notes)
- Show available time slots
- Validate all inputs
- Create reservation

**Data Required**:
- cartStore.items
- Restaurant info
- Available time slots

**Form Fields**:
- reservationDate: date picker
- reservationTime: time picker (only available slots)
- partySize: number input (1-50)
- specialRequests: text area (optional)

**Validation**:
- Date: >= today, <= 30 days from now
- Time: within restaurant hours & available
- PartySize: 1-50

**Computed**:
- totalAmount = sum(price * qty)
- estimatedReadyTime

**Error Handling**:
- Show validation errors
- Handle API errors
- Show availability errors

**On Success**:
- Create reservation via API
- Clear cart
- Navigate to Payment page
- Pass `reservationId` in URL/state

---

### Payment Page (`pages/Payment.tsx`)

**Functionality**:
- Display reservation summary
- Show payment method options
- Generate QR code (for Pichincha)
- Accept payment proof upload (for transfer)
- Display payment status

**Route Param**: `reservationId`

**Data Fetching**:
- `reservationService.getById(reservationId)`
- `paymentService.create(reservationId, method)`

**Components**:
- Reservation summary
- Payment method selector
- QR code display
- File upload (for proof)
- Payment status indicator

**Payment Methods**:
1. Pichincha QR: Display QR code, user scans with bank app
2. Transfer: Show bank details, user uploads proof screenshot
3. Cash: Show message "Pay at restaurant"
4. Card: Placeholder for future integration

**State Management**:
- Local state: selected method, upload progress
- Store payment creation response

**User Interactions**:
- Select payment method
- Download QR code
- Upload proof screenshot
- Confirm payment

**On Success**:
- Payment created
- Show confirmation
- Redirect to Orders page

---

### Orders Page (`pages/Orders.tsx`)

**Functionality**:
- List user's reservations/orders
- Show order status
- Filter by status
- Search orders

**Data Fetching**:
- `reservationService.getByUser()` on mount

**State Management**:
- orderStore: orders, loading, error
- Local state: filter, search query

**Components**:
- Order list
- Order card (status, items, date)
- Filter tabs (pending, confirmed, completed)
- Search input

**User Interactions**:
- Click order to view details
- Cancel order (if pending)
- Download receipt (if completed)

---

### Order Detail Page (`pages/OrderDetail.tsx`)

**Functionality**:
- Show order summary
- List items with prices
- Show payment status
- Show pickup time
- Allow cancel/review

**Route Param**: `orderId` (reservationId)

**Data Fetching**:
- `reservationService.getById(orderId)`
- `paymentService.getById(paymentId)` (if exists)

**Components**:
- Order header (code, status, date)
- Items list with subtotals
- Restaurant info
- Pickup time countdown
- Actions (cancel, review)

**User Interactions**:
- Cancel order (show confirmation)
- View restaurant details
- Rate restaurant (if completed)

---

### Restaurant Dashboard (`pages/RestaurantDashboard.tsx`)

**Functionality** (Owner View):
- Show restaurant stats (today's orders, revenue)
- List pending orders in Kanban board
- View daily menu management
- Edit restaurant details
- View analytics

**Data Fetching**:
- `restaurantService.getByUserId()`
- `reservationService.getByRestaurant()`
- Daily menu list

**Components**:
- Stats cards (orders, revenue, reviews)
- KanbanBoard (order management)
- Menu manager
- Restaurant edit form

**State Management**:
- restaurantStore: current restaurant
- Local state: view tabs

---

### Kitchen Dashboard (`pages/KitchenDashboard.tsx`)

**Functionality** (Chef/Staff View):
- Display orders in Kanban board
- Update order status (preparing, ready, completed)
- Show order details & items
- Receive notifications

**Components**:
- KanbanBoard (columns: pending, preparing, ready, served)
- KanbanColumn
- Order cards

**User Interactions**:
- Drag order between columns (if supported)
- Click to view full details
- Mark as ready

---

### Admin Dashboard (`pages/AdminDashboard.tsx`)

**Functionality**:
- System-wide stats
- User management
- Restaurant management
- Payment verification queue
- Reports

**Components**:
- Stats overview
- User list
- Restaurant list
- Payment verification queue

---

## 3.2 Components

### RestaurantCard (`components/restaurant/RestaurantCard.tsx`)

**Props**:
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant;
  distance?: number;
  onSelect: (restaurantId: string) => void;
}
```

**Renders**:
- Restaurant image
- Name
- Address
- Distance (if provided)
- Rating (future)
- Opening hours
- Click handler

**Interactions**:
- Click: call `onSelect(restaurant.id)`

---

### RestaurantList (`components/restaurant/RestaurantList.tsx`)

**Props**:
```typescript
interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  error?: string;
  onSelect: (restaurantId: string) => void;
}
```

**Renders**:
- Map of RestaurantCard components
- Loading spinner
- Error message
- Empty state

---

### MenuManager (`components/restaurant/MenuManager.tsx`)

**Props**:
```typescript
interface MenuManagerProps {
  restaurantId: string;
}
```

**Functionality**:
- List menu items
- Add/edit/delete items
- Categorize items

**Interactions**:
- Add item: open form modal
- Edit: click item → form
- Delete: confirm → API call

---

### KanbanBoard (`components/restaurant/KanbanBoard.tsx`)

**Props**:
```typescript
interface KanbanBoardProps {
  restaurantId: string;
  columns: string[];  // Status values
  onStatusChange: (orderId, newStatus) => void;
}
```

**Renders**:
- Horizontal layout of columns
- KanbanColumn for each status

**Data**:
- Fetch reservations by restaurant & status

---

### KanbanColumn (`components/restaurant/KanbanColumn.tsx`)

**Props**:
```typescript
interface KanbanColumnProps {
  status: string;
  orders: Reservation[];
  onDrop?: (orderId, newStatus) => void;
}
```

**Renders**:
- Column header with count
- Draggable order cards
- Add button (future)

---

### Button (`components/ui/Button.tsx`)

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

**Renders**: Styled button element

---

### Input (`components/ui/Input.tsx`)

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
```

**Renders**: Input field with optional error text

---

### Card (`components/ui/Card.tsx`)

**Props**:
```typescript
interface CardProps {
  children: ReactNode;
  className?: string;
}
```

**Renders**: Styled container card

---

### Modal (`components/ui/Modal.tsx`)

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
```

**Renders**: Modal overlay with content

---

### Alert (`components/ui/Alert.tsx`)

**Props**:
```typescript
interface AlertProps {
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
}
```

**Renders**: Alert box with icon & message

---

### Spinner (`components/ui/Spinner.tsx`)

**Props**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

**Renders**: Loading spinner animation

---

---

# 4. STORE SPECIFICATIONS (Zustand)

## 4.1 Auth Store

**Store Key**: `cpos-auth-storage`

**State**:
```typescript
{
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

**Actions**:

### `login(email: string, password: string): Promise<void>`
- Call `authService.signin()`
- Save token + user to state
- Save token to localStorage
- Trigger Axios interceptor update
- If error: set error message

### `signup(data: SignupData): Promise<void>`
- Call `authService.signup()`
- Auto-login (call `login()`)

### `logout(): void`
- Clear token from localStorage
- Clear state
- Notify Axios interceptor (will clear Authorization header)

### `refreshAccessToken(): Promise<void>`
- Get refresh token from localStorage
- Call `authService.refresh()`
- Update token in state & localStorage

### `checkAuth(): void`
- On app mount: check if token in localStorage
- If exists: fetch user via `authService.getMe()`
- Update state accordingly

**Persisted**: token, user (to localStorage)

**Axios Integration**:
- Interceptor reads `token` from store
- Adds `Authorization: Bearer {token}` to all requests
- 401 response triggers `logout()`

---

## 4.2 Cart Store

**State**:
```typescript
{
  items: CartItem[];
  restaurantId: string | null;
  loading: boolean;
}
```

**Computed**:
```typescript
{
  totalItems: () => number;
  totalAmount: () => number;
  itemCount: (menuItemId) => number;
}
```

**Actions**:

### `addItem(menuItem: MenuItem, quantity: number, restaurantId: string): void`
- If cart has items from different restaurant: warn user
- Add item to cart (or update qty if exists)
- Set `restaurantId`
- Persist to localStorage

### `updateItem(menuItemId: string, quantity: number): void`
- If quantity=0: remove item
- Update quantity
- Persist to localStorage

### `removeItem(menuItemId: string): void`
- Remove from array
- If cart empty: set restaurantId=null
- Persist to localStorage

### `clearCart(): void`
- Empty items array
- Reset restaurantId
- Clear localStorage

**Persisted**: items, restaurantId (to localStorage)

---

## 4.3 Restaurant Store

**State**:
```typescript
{
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  dailyMenus: DailyMenu[];
  loading: boolean;
  error: string | null;
}
```

**Actions**:

### `fetchRestaurants(page?, limit?): Promise<void>`
- Call `restaurantService.findAll()`
- Update `restaurants` state
- Handle loading/error

### `fetchNearbyRestaurants(latitude: number, longitude: number, maxKm?): Promise<void>`
- Call `restaurantService.findNearby()`
- Update `restaurants` with distance info
- Sort by distance ascending

### `selectRestaurant(restaurantId: string): Promise<void>`
- Call `restaurantService.getById(restaurantId)`
- Set `selectedRestaurant`
- Fetch menu items & daily menus
- Update state

### `fetchMenuItems(restaurantId: string): Promise<void>`
- Call `menuItemService.findByRestaurant(restaurantId)`
- Update `menuItems` state

### `fetchDailyMenus(restaurantId: string): Promise<void>`
- Call `dailyMenuService.findByRestaurant(restaurantId)`
- Update `dailyMenus` state

---

## 4.4 Order Store

**State**:
```typescript
{
  orders: Reservation[];
  selectedOrder: Reservation | null;
  loading: boolean;
  error: string | null;
}
```

**Actions**:

### `fetchOrders(): Promise<void>`
- Call `reservationService.getByUser()`
- Update `orders` state
- Sort by createdAt descending

### `selectOrder(orderId: string): Promise<void>`
- Call `reservationService.getById(orderId)`
- Set `selectedOrder`
- Include payment info

### `cancelOrder(orderId: string, reason?): Promise<void>`
- Call `reservationService.cancel(orderId)`
- Refresh orders list
- Show confirmation

### `refreshOrders(): Promise<void>`
- Call `fetchOrders()`
- Update state

---

---

# 5. DATABASE SCHEMA SPECIFICATIONS

## 5.1 Tables

### `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_deleted_at (deleted_at)
);
```

---

### `restaurants`

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  base_price DECIMAL(10, 2) DEFAULT 5.0,
  is_open BOOLEAN DEFAULT true,
  opening_time VARCHAR(5),  -- HH:MM
  closing_time VARCHAR(5),  -- HH:MM
  bank_account VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_name (name),
  INDEX idx_location (latitude, longitude),
  INDEX idx_deleted_at (deleted_at)
);
```

---

### `user_restaurants`

```sql
CREATE TABLE user_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'MANAGER', 'CHEF', 'STAFF')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, restaurant_id),
  INDEX idx_user_id (user_id),
  INDEX idx_restaurant_id (restaurant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

---

### `menu_items`

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_category (category),
  INDEX idx_available (available),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

---

### `daily_menus`

```sql
CREATE TABLE daily_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  nombre VARCHAR(100) NOT NULL,
  imagen VARCHAR(500),
  price DECIMAL(10, 2) DEFAULT 5.0,
  sopa_name VARCHAR(100) NOT NULL,
  sopa_extras VARCHAR(200),
  proteina_name VARCHAR(100) NOT NULL,
  guarniciones VARCHAR(200),
  ensalada VARCHAR(200),
  bebida VARCHAR(100),
  postre VARCHAR(100),
  is_active BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_date (date),
  INDEX idx_is_active (is_active),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

---

### `reservations`

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(5) NOT NULL,  -- HH:MM
  party_size INT NOT NULL CHECK (party_size >= 1 AND party_size <= 50),
  special_requests TEXT,
  status VARCHAR(50) NOT NULL CHECK (
    status IN ('PENDING', 'CONFIRMED', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED')
  ) DEFAULT 'PENDING',
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_status (status),
  INDEX idx_reservation_date (reservation_date),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

---

### `reservation_items`

```sql
CREATE TABLE reservation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INT NOT NULL CHECK (quantity >= 1),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_reservation_id (reservation_id),
  INDEX idx_menu_item_id (menu_item_id),
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

### `payments`

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  reservation_id UUID UNIQUE NOT NULL REFERENCES reservations(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL CHECK (
    status IN ('PENDING', 'AWAITING_PROOF', 'VERIFIED', 'COMPLETED', 'FAILED', 'CANCELLED')
  ) DEFAULT 'PENDING',
  method VARCHAR(50) NOT NULL CHECK (
    method IN ('PICHINCHA_QR', 'TRANSFER', 'CASH', 'CARD')
  ),
  qr_code TEXT,  -- Base64 encoded QR
  qr_expiry TIMESTAMP,
  proof_url VARCHAR(500),  -- URL to uploaded proof
  proof_verified_at TIMESTAMP,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_reservation_id (reservation_id),
  INDEX idx_status (status),
  INDEX idx_method (method),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);
```

---

### `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 5.2 Key Constraints & Validations

| Table | Field | Constraint | Notes |
|-------|-------|-----------|-------|
| users | email | UNIQUE, NOT NULL | Case-insensitive matching |
| users | password_hash | NOT NULL | bcryptjs hash |
| users | role | CHECK, NOT NULL | Enum: CUSTOMER, RESTAURANT_OWNER, ADMIN |
| restaurants | name | UNIQUE, NOT NULL | 2-100 chars |
| restaurants | latitude, longitude | NOT NULL | Valid Ecuador coords |
| reservations | status | CHECK | Enum with valid transitions |
| reservations | reservation_date | NOT NULL | Must be >= today |
| payments | method | CHECK | Enum of payment methods |
| payments | status | CHECK | Enum with valid transitions |

---

---

# 6. E2E USER FLOWS

## 6.1 Customer Order Flow

```
1. USER REGISTRATION
   User → Signup Form
   ├─ Email, Password, Name, Phone, Role=CUSTOMER
   ├─ Validate inputs (Zod)
   ├─ POST /api/v1/auth/signup
   ├─ Backend: Hash password, create user
   └─ Frontend: Save token, redirect to Home

2. SEARCH RESTAURANTS
   User → Home Page
   ├─ Request geolocation (browser)
   ├─ Geolocation → restaurantStore.fetchNearbyRestaurants(lat, lng)
   ├─ GET /api/v1/restaurants/nearby?lat=X&lng=Y&maxKm=5
   ├─ Backend: PostGIS distance calculation
   └─ Display RestaurantList sorted by distance

3. VIEW MENU
   User → Click RestaurantCard
   ├─ Navigate to /restaurant/:id
   ├─ restaurantStore.selectRestaurant(id)
   ├─ GET /api/v1/restaurants/:id (details + menu)
   └─ Display menu items by category

4. BUILD CART
   User → Click "Add to Cart"
   ├─ cartStore.addItem(menuItem, qty, restaurantId)
   ├─ Zustand state updated
   └─ Show cart icon with count

5. CHECKOUT
   User → Click "Checkout"
   ├─ Navigate to /checkout
   ├─ Display: cart items, total, delivery date/time
   ├─ User selects date & time
   ├─ GET /api/v1/reservations/available-slots/:restaurantId?date=X
   ├─ User confirms
   └─ POST /api/v1/reservations (create order)

6. PAYMENT
   POST /api/v1/reservations response → reservation object
   ├─ Navigate to /payment/:reservationId
   ├─ POST /api/v1/payments (create payment)
   │  ├─ If Pichincha: Generate QR code
   │  └─ If Transfer: Show bank details
   ├─ User completes payment (offline process)
   ├─ If proof required: POST /api/v1/payments/:id/upload-proof
   └─ Admin verifies proof → Payment VERIFIED

7. ORDER TRACKING
   User → /orders
   ├─ GET /api/v1/reservations (get user's orders)
   ├─ Display list with statuses
   ├─ Click order → /order-detail/:id
   └─ Track status changes (PENDING → CONFIRMED → READY → COMPLETED)
```

---

## 6.2 Restaurant Owner Workflow

```
1. SIGN UP & ONBOARD
   Owner → Signup Form (role=RESTAURANT_OWNER)
   ├─ Create account
   ├─ Auto-login
   └─ Redirect to /onboarding or /restaurant-dashboard

2. CREATE RESTAURANT
   Owner → Restaurant creation form
   ├─ Enter: name, address, phone, latitude, longitude, hours
   ├─ POST /api/v1/restaurants
   └─ Backend: Create restaurant + UserRestaurant (role=OWNER)

3. MANAGE MENU
   Owner → /menu-management
   ├─ View existing menu items
   ├─ Add new item: POST /api/v1/menu-items
   ├─ Edit item: PATCH /api/v1/menu-items/:id
   └─ Delete item: DELETE /api/v1/menu-items/:id

4. MANAGE DAILY MENU
   Owner → /restaurant-dashboard
   ├─ Create daily menu: POST /api/v1/daily-menus
   ├─ Activate for sale: PUT /api/v1/daily-menus/:id/activate
   └─ Show in customer view

5. VIEW ORDERS
   Owner → Restaurant Dashboard
   ├─ GET /api/v1/reservations?restaurantId=X
   ├─ Display Kanban board: PENDING → CONFIRMED → READY → COMPLETED
   └─ Update status via drag-drop or click

6. CONFIRM ORDER
   Owner/Chef → KitchenDashboard
   ├─ See PENDING order in "New Orders" column
   ├─ Click to view items
   ├─ Drag to "Preparing"
   ├─ When done: drag to "Ready for Pickup"
   └─ PATCH /api/v1/reservations/:id/confirm

7. MANAGE PAYMENTS
   Owner → Admin section
   ├─ GET /api/v1/payments?restaurantId=X&status=AWAITING_PROOF
   ├─ Review uploaded proofs
   ├─ Verify: PATCH /api/v1/payments/:id/verify
   └─ Receive completion notification
```

---

## 6.3 Admin Workflow

```
1. ADMIN LOGIN
   Admin → /login (role=ADMIN)
   ├─ Login with admin account
   └─ Redirect to /admin-dashboard

2. VERIFY PAYMENTS
   Admin → /admin/payments
   ├─ GET /api/v1/payments?status=AWAITING_PROOF
   ├─ Review proof screenshots
   ├─ Verify: PATCH /api/v1/payments/:id/verify?verified=true
   └─ Payment status changes to VERIFIED

3. MANAGE USERS
   Admin → /admin/users
   ├─ List users
   ├─ Search/filter
   ├─ View user details
   └─ Deactivate if needed

4. MANAGE RESTAURANTS
   Admin → /admin/restaurants
   ├─ List all restaurants
   ├─ View details
   ├─ Take action if violations
   └─ View analytics per restaurant

5. VIEW SYSTEM HEALTH
   Admin → Dashboard
   ├─ Total orders
   ├─ Total revenue
   ├─ Active users
   ├─ Active restaurants
   └─ System status
```

---

---

# 7. ERROR HANDLING SPECIFICATIONS

## 7.1 HTTP Status Codes

| Code | Usage | Example |
|------|-------|---------|
| 200 | Successful request | GET /restaurants |
| 201 | Resource created | POST /reservations |
| 204 | No content | DELETE /menu-items/:id |
| 400 | Bad request | Invalid email format, missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User not authorized for this action |
| 404 | Not found | Restaurant/reservation doesn't exist |
| 409 | Conflict | Email exists, name duplicate |
| 422 | Validation error | Zod validation failed |
| 429 | Rate limit | Too many requests (future) |
| 500 | Server error | Unhandled exception |
| 503 | Service unavailable | Database offline |

---

## 7.2 Error Response Format

All errors return JSON:
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "ConflictException",
  "timestamp": "2025-02-05T10:30:00.000Z"
}
```

For validation errors (Zod):
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must contain uppercase letter"
    }
  ]
}
```

---

## 7.3 Frontend Error Handling

### API Error Interceptor
```typescript
// Axios interceptor in api.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear auth state & redirect to login
      authStore.logout();
      window.location.href = '/login';
    } else if (status === 403) {
      // Show "not authorized" message
      showAlert('error', 'You are not authorized to perform this action');
    } else if (status === 404) {
      // Handle not found
      showAlert('error', 'Resource not found');
    } else {
      // Show generic error
      showAlert('error', error.response?.data?.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);
```

### Component Error Handling
```typescript
// In pages/Checkout.tsx
try {
  const reservation = await reservationService.create(data);
  navigate(`/payment/${reservation.id}`);
} catch (error) {
  if (error.response?.status === 409) {
    showAlert('error', 'This restaurant is closed at the requested time');
  } else if (error.response?.status === 404) {
    showAlert('error', 'Menu item is no longer available');
  } else {
    showAlert('error', 'Failed to create reservation. Please try again.');
  }
}
```

---

---

# 8. SECURITY & AUTH SPECIFICATIONS

## 8.1 Authentication

### JWT Token Structure

**Access Token**:
- Type: Bearer token
- Expiration: 1 hour
- Payload:
  ```json
  {
    "sub": "user-id",
    "email": "user@example.com",
    "role": "CUSTOMER",
    "iat": 1675000000,
    "exp": 1675003600
  }
  ```

**Refresh Token**:
- Expiration: 7 days
- Stored in: `refresh_tokens` table
- Returned to client: stored in secure cookie or localStorage

### Password Requirements
- Minimum: 8 characters
- Must include: uppercase letter, number, special symbol
- Hash algorithm: bcryptjs (10 salt rounds)
- Never return hash in API responses

### Token Refresh Flow
```
1. Access token expires (1 hour)
2. Frontend Axios interceptor detects 401
3. Call POST /api/v1/auth/refresh with refresh token
4. Backend validates & generates new access token
5. Frontend updates token in localStorage & Zustand
6. Retry original request with new token
```

---

## 8.2 Authorization

### Role-Based Access Control (RBAC)

**Available Roles**:
- `CUSTOMER`: Can order, pay, track orders
- `RESTAURANT_OWNER`: Can manage own restaurant, menu, orders
- `ADMIN`: Full system access
- `STAFF` (in UserRestaurant): Can confirm orders, update status

### Protected Routes

**Backend** (NestJS Guards):
```typescript
@UseGuards(JwtAuthGuard)           // Any authenticated user
@Roles('RESTAURANT_OWNER')         // Must be restaurant owner
@CheckRestaurantOwner()            // Must own the restaurant being accessed
```

**Frontend** (React Router):
```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/checkout" element={<Checkout />} />
</Route>

<Route element={<RestaurantOwnerRoute />}>
  <Route path="/restaurant-dashboard" element={<Dashboard />} />
</Route>
```

### Authorization Examples

| Action | Who Can Do It |
|--------|---------------|
| View own orders | CUSTOMER, ADMIN |
| Cancel own order | CUSTOMER (if PENDING), ADMIN |
| Create restaurant | RESTAURANT_OWNER, ADMIN |
| Edit restaurant | Restaurant OWNER, ADMIN |
| Confirm order | Restaurant OWNER/MANAGER/CHEF, ADMIN |
| Verify payment | Restaurant OWNER/MANAGER, ADMIN |
| View all payments | ADMIN only |
| Create user | ADMIN (in future) |

---

## 8.3 Security Best Practices

### Data Validation

**Frontend**:
- React Hook Form + Zod for client validation
- Email, phone, URLs validated before submission
- File upload: check type & size

**Backend**:
- All inputs validated with Zod before processing
- SQL injection prevention: ORM (Prisma) + parameterized queries
- XSS prevention: Helmet middleware, content-security-policy headers

### CORS Configuration
```typescript
// In backend (NestJS)
CorsModule.register({
  origin: [
    'http://localhost:5173',      // Local dev
    'https://almuerzaya.com',     // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### API Rate Limiting (Future)
```
- 100 requests per minute per IP (general)
- 20 requests per minute per user (auth endpoints)
- 500 requests per minute per user (authenticated)
```

### Sensitive Data
- **Never** log passwords or tokens
- **Never** return hashed passwords in API responses
- Use `deletedAt` for soft deletes (preserve audit trail)
- Tokens marked as revoked in `refresh_tokens.revoked_at`

### HTTPS/TLS
- All production traffic over HTTPS
- Secure cookies (HttpOnly, SameSite=Strict)
- HSTS headers enabled

### Secrets Management
- Store `JWT_SECRET`, `JWT_REFRESH_SECRET` in environment variables
- Never commit `.env` files
- Use `.env.example` for template

---

## 8.4 Request Authentication Flow

```
1. User logs in
   POST /api/v1/auth/signin
   ← Returns { user, accessToken, refreshToken }

2. Frontend stores token
   localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
   authStore.setToken(accessToken);

3. All subsequent requests
   GET /api/v1/restaurants
   Header: Authorization: Bearer {accessToken}

4. Backend JWT middleware
   JwtAuthGuard.canActivate()
   ├─ Extract token from Authorization header
   ├─ Verify JWT signature using JWT_SECRET
   ├─ Validate expiration
   ├─ Extract user ID from payload
   └─ Attach to request.user for controller access

5. Token expires (after 1 hour)
   POST /api/v1/auth/refresh
   Authorization: Bearer {refreshToken}
   ← Returns { accessToken, refreshToken? }

6. Token invalid → 401 response
   Frontend Axios interceptor:
   ├─ Detect 401
   ├─ Call refresh endpoint (retry flow)
   ├─ If refresh fails → logout() → redirect to /login
   └─ If successful → retry original request
```

---

---

# APPENDIX

## A. Validation Rules

### Email
```typescript
const emailSchema = z.string().email();
```

### Password
```typescript
const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 characters')
  .regex(/[A-Z]/, 'Must include uppercase letter')
  .regex(/[0-9]/, 'Must include number')
  .regex(/[!@#$%^&*]/, 'Must include special character');
```

### Phone (E164)
```typescript
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
```

### URL
```typescript
const urlSchema = z.string().url().or(z.literal(''));
```

---

## B. Sample API Requests

### Create Reservation
```bash
POST /api/v1/reservations
Authorization: Bearer eyJhbGc...

{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
  "reservationDate": "2025-02-06",
  "reservationTime": "12:30",
  "partySize": 2,
  "specialRequests": "Extra spicy, no onions",
  "items": [
    { "menuItemId": "abc-123", "quantity": 1 },
    { "menuItemId": "def-456", "quantity": 2 }
  ]
}

Response:
{
  "id": "res-789",
  "reservationCode": "AY-2025-001234",
  "status": "PENDING",
  "totalAmount": 15.50,
  "createdAt": "2025-02-05T10:30:00Z"
}
```

### Upload Payment Proof
```bash
POST /api/v1/payments/pay-123/upload-proof
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

file: <binary image data>

Response:
{
  "id": "pay-123",
  "status": "AWAITING_PROOF",
  "proofUrl": "https://storage.example.com/proofs/pay-123.jpg"
}
```

---

## C. Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/almuerzaya
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_TOKEN_EXPIRY=3600      # 1 hour
JWT_REFRESH_TOKEN_EXPIRY=604800   # 7 days
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Almuerza Ya
VITE_MAX_DISTANCE_KM=5
VITE_GOOGLE_MAPS_KEY=your-api-key
```

---

## D. Testing Checklist

### Unit Tests
- [ ] Auth service password hashing
- [ ] Auth service token generation
- [ ] Restaurant geolocation queries
- [ ] Reservation validation rules
- [ ] Payment status transitions
- [ ] Cart store persistence

### Integration Tests
- [ ] Full signup flow
- [ ] Full order flow (search → checkout → payment)
- [ ] Token refresh
- [ ] Database transactions

### E2E Tests (Playwright)
- [ ] Login → Home → Restaurant → Checkout → Payment
- [ ] Restaurant owner: Create menu → Create daily menu → Confirm orders
- [ ] Admin: Verify payments → View reports

---

**Document Version**: 1.0 | **Last Updated**: 2025-02-05 | **Status**: Production-Ready

Este documento es la fuente de verdad para Spec-Driven Development del proyecto **Almuerza Ya**.
