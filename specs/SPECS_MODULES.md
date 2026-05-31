# SPECIFICATIONS: MÓDULOS DETALLADOS

**Especificaciones técnicas por módulo** | Almuerza Ya

---

## ÍNDICE

1. [Auth Module](#auth-module)
2. [Restaurant Module](#restaurant-module)
3. [Menu Item Module](#menu-item-module)
4. [Daily Menu Module](#daily-menu-module)
5. [Reservation Module](#reservation-module)
6. [Payment Module](#payment-module)
7. [Frontend Hooks](#frontend-hooks)
8. [Frontend Services](#frontend-services)

---

# AUTH MODULE

## Backend: `apps/backend/src/modules/auth`

### Files Structure
```
auth/
├── auth.module.ts           # NestJS module definition
├── controllers/
│   └── auth.controller.ts   # REST endpoints
├── services/
│   └── auth.service.ts      # Business logic
├── guards/
│   └── jwt.guard.ts         # JWT validation guard
└── strategies/
    └── jwt.strategy.ts      # Passport JWT strategy
```

### Auth Controller Endpoints

#### `POST /auth/signup`
```typescript
// Controller
@Post('signup')
@HttpCode(201)
async signup(@Body() dto: CreateUserDto): Promise<AuthResponse> {
  return this.authService.signup(dto);
}

// DTO (Zod validation in service)
interface CreateUserDto {
  email: string;        // Required. email format
  password: string;     // Required. 8+, 1 upper, 1 digit, 1 symbol
  firstName: string;    // Required. 2-50 chars
  lastName: string;     // Required. 2-50 chars
  phone?: string;       // Optional. E164 format
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER';  // Default: CUSTOMER
}

// Response
interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken?: string;
}
```

**Service Logic**:
```typescript
// In auth.service.ts
async signup(dto: CreateUserDto): Promise<AuthResponse> {
  // 1. Validate with Zod
  const validated = signupSchema.parse(dto);

  // 2. Check email unique
  const existing = await this.prisma.user.findUnique({
    where: { email: validated.email.toLowerCase() }
  });
  if (existing) throw new ConflictException('Email already exists');

  // 3. Hash password
  const passwordHash = await bcrypt.hash(validated.password, 10);

  // 4. Create user
  const user = await this.prisma.user.create({
    data: {
      email: validated.email.toLowerCase(),
      passwordHash,
      firstName: validated.firstName,
      lastName: validated.lastName,
      phone: validated.phone,
      role: validated.role || 'CUSTOMER',
    },
  });

  // 5. Generate tokens
  const { accessToken, refreshToken } = this.generateTokens(user.id);

  // 6. Store refresh token
  await this.prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: this.sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}
```

---

#### `POST /auth/signin`
```typescript
// Controller
@Post('signin')
@HttpCode(200)
async signin(@Body() dto: SigninDto): Promise<AuthResponse> {
  return this.authService.signin(dto);
}

// DTO
interface SigninDto {
  email: string;      // Required
  password: string;   // Required
}
```

**Service Logic**:
```typescript
async signin(dto: SigninDto): Promise<AuthResponse> {
  // 1. Find user
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email.toLowerCase() }
  });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // 2. Compare password
  const isValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isValid) throw new UnauthorizedException('Invalid credentials');

  // 3. Invalidate old refresh tokens
  await this.prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  // 4. Generate new tokens
  const { accessToken, refreshToken } = this.generateTokens(user.id);

  // 5. Store new refresh token
  await this.prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: this.sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}
```

---

#### `POST /auth/refresh`
```typescript
// Controller
@Post('refresh')
@UseGuards(JwtRefreshGuard)
async refresh(@Request() req): Promise<{ accessToken: string }> {
  return this.authService.refreshAccessToken(req.user.id);
}
```

**Service Logic**:
```typescript
async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
  // 1. Check user exists
  const user = await this.prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) throw new NotFoundException('User not found');

  // 2. Generate new access token
  const accessToken = this.generateAccessToken(user.id);

  return { accessToken };
}
```

---

#### `GET /auth/me`
```typescript
// Controller
@Get('me')
@UseGuards(JwtAuthGuard)
async getCurrentUser(@Request() req): Promise<User> {
  return this.authService.getCurrentUser(req.user.id);
}
```

**Service Logic**:
```typescript
async getCurrentUser(userId: string): Promise<User> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurantRoles: {
        include: {
          restaurant: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  if (!user || user.deletedAt) throw new NotFoundException('User not found');

  return this.sanitizeUser(user);
}
```

---

#### `POST /auth/logout`
```typescript
// Controller
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(@Request() req): Promise<{ message: string }> {
  await this.authService.logout(req.user.id);
  return { message: 'Logged out successfully' };
}
```

**Service Logic**:
```typescript
async logout(userId: string): Promise<void> {
  // Revoke all refresh tokens
  await this.prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}
```

---

### JWT Guard Implementation

```typescript
// jwt.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
```

---

### JWT Strategy (Passport)

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

---

### Token Generation

```typescript
// In auth.service.ts
private generateTokens(userId: string): { accessToken: string; refreshToken: string } {
  const payload = { sub: userId, email: user.email, role: user.role };

  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  });

  const refreshToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

private generateAccessToken(userId: string): string {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  const payload = { sub: userId, email: user.email, role: user.role };

  return this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  });
}
```

---

### Auth Module Definition

```typescript
// auth.module.ts
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
```

---

---

# RESTAURANT MODULE

## Backend: `apps/backend/src/modules/restaurant`

### Files Structure
```
restaurant/
├── restaurant.module.ts
├── controllers/
│   └── restaurant.controller.ts
└── services/
    └── restaurant.service.ts
```

### Restaurant Controller

```typescript
// restaurant.controller.ts
@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.restaurantService.findAll({ page, limit, search });
  }

  @Get('nearby')
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'maxKm', required: false })
  async findNearby(
    @Query('latitude') lat: number,
    @Query('longitude') lng: number,
    @Query('maxKm') maxKm?: number,
  ) {
    return this.restaurantService.findNearby(lat, lng, maxKm);
  }

  @Get('mine/my-restaurant')
  @UseGuards(JwtAuthGuard)
  @Roles('RESTAURANT_OWNER')
  async getMyRestaurant(@Request() req) {
    return this.restaurantService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('RESTAURANT_OWNER')
  @HttpCode(201)
  async create(@Request() req, @Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string, @Request() req) {
    await this.restaurantService.delete(id, req.user.id);
  }
}
```

---

### Restaurant Service

```typescript
// restaurant.service.ts
@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.RestaurantWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ]
      })
    };

    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          menuItems: { where: { deletedAt: null } },
          dailyMenus: { where: { deletedAt: null, isActive: true } }
        },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findNearby(latitude: number, longitude: number, maxKm: number = 5) {
    // PostGIS query for geolocation
    const point = `POINT(${longitude} ${latitude})`;
    const maxMeters = maxKm * 1000;

    const restaurants = await this.prisma.$queryRaw`
      SELECT
        r.*,
        ST_Distance(
          ST_GeogFromText('SRID=4326;POINT(' || r.longitude || ' ' || r.latitude || ')'),
          ST_GeogFromText('SRID=4326;${point}')
        ) / 1000 AS distance
      FROM restaurants r
      WHERE
        r.deleted_at IS NULL
        AND ST_DWithin(
          ST_GeogFromText('SRID=4326;POINT(' || r.longitude || ' ' || r.latitude || ')'),
          ST_GeogFromText('SRID=4326;${point}'),
          ${maxMeters}
        )
      ORDER BY distance ASC
      LIMIT 50
    `;

    return {
      data: restaurants,
      center: { latitude, longitude },
    };
  }

  async findById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: { where: { deletedAt: null } },
        dailyMenus: { where: { deletedAt: null } },
        userRoles: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } }
        }
      },
    });

    if (!restaurant || restaurant.deletedAt) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async findByUserId(userId: string) {
    const userRestaurant = await this.prisma.userRestaurant.findFirst({
      where: { userId, role: 'OWNER' },
      include: { restaurant: true },
    });

    if (!userRestaurant) {
      throw new NotFoundException('User has no restaurant');
    }

    return userRestaurant.restaurant;
  }

  async create(dto: CreateRestaurantDto, userId: string) {
    // Validate coordinates are within Ecuador
    this.validateCoordinates(dto.latitude, dto.longitude);

    // Create restaurant
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        imageUrl: dto.imageUrl,
        basePrice: dto.basePrice || 5.0,
        isOpen: true,
        openingTime: dto.openingTime,
        closingTime: dto.closingTime,
        bankAccount: dto.bankAccount,
      },
    });

    // Create UserRestaurant relationship
    await this.prisma.userRestaurant.create({
      data: {
        userId,
        restaurantId: restaurant.id,
        role: 'OWNER',
      },
    });

    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto, userId: string) {
    // Check authorization
    const auth = await this.checkOwnership(id, userId);
    if (!auth) throw new ForbiddenException();

    // Validate new coordinates if provided
    if (dto.latitude && dto.longitude) {
      this.validateCoordinates(dto.latitude, dto.longitude);
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        imageUrl: dto.imageUrl,
        basePrice: dto.basePrice,
        isOpen: dto.isOpen,
        openingTime: dto.openingTime,
        closingTime: dto.closingTime,
        bankAccount: dto.bankAccount,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string) {
    const auth = await this.checkOwnership(id, userId);
    if (!auth) throw new ForbiddenException();

    // Soft delete restaurant
    await this.prisma.restaurant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Cascade soft delete
    await this.prisma.menuItem.updateMany({
      where: { restaurantId: id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.dailyMenu.updateMany({
      where: { restaurantId: id },
      data: { deletedAt: new Date() },
    });
  }

  private async checkOwnership(restaurantId: string, userId: string): Promise<boolean> {
    const record = await this.prisma.userRestaurant.findFirst({
      where: {
        restaurantId,
        userId,
        role: 'OWNER',
      },
    });
    return !!record;
  }

  private validateCoordinates(latitude: number, longitude: number) {
    // Ecuador bounds
    const minLat = -5.0;
    const maxLat = 2.0;
    const minLng = -81.0;
    const maxLng = -75.0;

    if (
      latitude < minLat ||
      latitude > maxLat ||
      longitude < minLng ||
      longitude > maxLng
    ) {
      throw new BadRequestException('Coordinates are outside Ecuador bounds');
    }
  }
}
```

---

### DTOs (Data Transfer Objects)

```typescript
// restaurant.dto.ts
export class CreateRestaurantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  basePrice?: number;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @IsOptional()
  openingTime?: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @IsOptional()
  closingTime?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;
}

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
```

---

---

# MENU ITEM MODULE

## Backend: `apps/backend/src/modules/menu-item`

### Menu Item Controller

```typescript
@Controller('menu-items')
@ApiTags('Menu Items')
export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  @Get('restaurant/:restaurantId')
  async findByRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('category') category?: string,
  ) {
    return this.menuItemService.findByRestaurant(restaurantId, {
      page,
      limit,
      category,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.menuItemService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async create(@Request() req, @Body() dto: CreateMenuItemDto) {
    return this.menuItemService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string, @Request() req) {
    await this.menuItemService.delete(id, req.user.id);
  }
}
```

---

### Menu Item Service

```typescript
@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async findByRestaurant(
    restaurantId: string,
    options: { page: number; limit: number; category?: string },
  ) {
    const { page, limit, category } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.MenuItemWhereInput = {
      restaurantId,
      deletedAt: null,
      ...(category && { category }),
    };

    const [data, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findById(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!item || item.deletedAt) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  async create(dto: CreateMenuItemDto, userId: string) {
    // Verify restaurant ownership
    const isOwner = await this.isRestaurantOwner(dto.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    return this.prisma.menuItem.create({
      data: {
        restaurantId: dto.restaurantId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        imageUrl: dto.imageUrl,
        available: dto.available ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateMenuItemDto, userId: string) {
    const item = await this.findById(id);

    const isOwner = await this.isRestaurantOwner(item.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        imageUrl: dto.imageUrl,
        available: dto.available,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string) {
    const item = await this.findById(id);

    const isOwner = await this.isRestaurantOwner(item.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    await this.prisma.menuItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async isRestaurantOwner(restaurantId: string, userId: string): Promise<boolean> {
    const record = await this.prisma.userRestaurant.findFirst({
      where: {
        restaurantId,
        userId,
        role: 'OWNER',
      },
    });
    return !!record;
  }
}
```

---

### Menu Item DTOs

```typescript
export class CreateMenuItemDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsEnum(['Sopa', 'Segundo', 'Bebida', 'Postre', 'Entrada', 'Extras'])
  category: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
```

---

---

# DAILY MENU MODULE

## Backend: `apps/backend/src/modules/daily-menu`

### Daily Menu Controller

```typescript
@Controller('daily-menus')
@ApiTags('Daily Menus')
export class DailyMenuController {
  constructor(private dailyMenuService: DailyMenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async create(@Request() req, @Body() dto: CreateDailyMenuDto) {
    return this.dailyMenuService.create(dto, req.user.id);
  }

  @Get(':restaurantId')
  async findByRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query('date') date?: string,
    @Query('limit') limit: number = 7,
  ) {
    return this.dailyMenuService.findByRestaurant(restaurantId, { date, limit });
  }

  @Get(':id/detail')
  async getDetail(@Param('id') id: string) {
    return this.dailyMenuService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Request() req, @Body() dto: UpdateDailyMenuDto) {
    return this.dailyMenuService.update(id, dto, req.user.id);
  }

  @Put(':id/activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Param('id') id: string, @Request() req, @Body() dto: { isActive: boolean }) {
    return this.dailyMenuService.activate(id, dto.isActive, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string, @Request() req) {
    await this.dailyMenuService.delete(id, req.user.id);
  }
}
```

---

### Daily Menu Service

```typescript
@Injectable()
export class DailyMenuService {
  constructor(private prisma: PrismaService) {}

  async findByRestaurant(
    restaurantId: string,
    options: { date?: string; limit?: number },
  ) {
    const { limit = 7 } = options;
    const startDate = options.date ? new Date(options.date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + limit);

    const dailyMenus = await this.prisma.dailyMenu.findMany({
      where: {
        restaurantId,
        deletedAt: null,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    return { data: dailyMenus, restaurant };
  }

  async findById(id: string) {
    const menu = await this.prisma.dailyMenu.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!menu || menu.deletedAt) {
      throw new NotFoundException('Daily menu not found');
    }

    return menu;
  }

  async create(dto: CreateDailyMenuDto, userId: string) {
    const isOwner = await this.isRestaurantOwner(dto.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    return this.prisma.dailyMenu.create({
      data: {
        restaurantId: dto.restaurantId,
        nombre: dto.nombre,
        imagen: dto.imagen,
        price: dto.price || 5.0,
        sopaName: dto.sopaName,
        sopaExtras: dto.sopaExtras,
        proteinaName: dto.proteinaName,
        guarniciones: dto.guarniciones,
        ensalada: dto.ensalada,
        bebida: dto.bebida,
        postre: dto.postre,
        isActive: false,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateDailyMenuDto, userId: string) {
    const menu = await this.findById(id);
    const isOwner = await this.isRestaurantOwner(menu.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    return this.prisma.dailyMenu.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        imagen: dto.imagen,
        price: dto.price,
        sopaName: dto.sopaName,
        sopaExtras: dto.sopaExtras,
        proteinaName: dto.proteinaName,
        guarniciones: dto.guarniciones,
        ensalada: dto.ensalada,
        bebida: dto.bebida,
        postre: dto.postre,
        updatedAt: new Date(),
      },
    });
  }

  async activate(id: string, isActive: boolean, userId: string) {
    const menu = await this.findById(id);
    const isOwner = await this.isRestaurantOwner(menu.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    return this.prisma.dailyMenu.update({
      where: { id },
      data: { isActive, updatedAt: new Date() },
    });
  }

  async delete(id: string, userId: string) {
    const menu = await this.findById(id);
    const isOwner = await this.isRestaurantOwner(menu.restaurantId, userId);
    if (!isOwner) throw new ForbiddenException();

    await this.prisma.dailyMenu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async isRestaurantOwner(restaurantId: string, userId: string): Promise<boolean> {
    const record = await this.prisma.userRestaurant.findFirst({
      where: { restaurantId, userId, role: 'OWNER' },
    });
    return !!record;
  }
}
```

---

---

# RESERVATION MODULE

## Backend: `apps/backend/src/modules/reservation`

### Reservation Controller

```typescript
@Controller('reservations')
@ApiTags('Reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async create(@Request() req, @Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getByUser(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.reservationService.getByUser(req.user.id, { page, limit, status });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.reservationService.getById(id);
  }

  @Get('available-slots/:restaurantId')
  async getAvailableSlots(
    @Param('restaurantId') restaurantId: string,
    @Query('date') date: string,
    @Query('partySize') partySize: number = 1,
  ) {
    return this.reservationService.getAvailableSlots(restaurantId, date, partySize);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirm(@Param('id') id: string, @Request() req) {
    return this.reservationService.confirm(id, req.user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(@Param('id') id: string, @Request() req, @Body() dto: { reason?: string }) {
    return this.reservationService.cancel(id, req.user.id, dto.reason);
  }
}
```

---

### Reservation Service

```typescript
@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService, // For notifications
  ) {}

  async create(dto: CreateReservationDto, userId: string) {
    // Validate all inputs
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // Validate date & time
    const reservationDate = new Date(dto.reservationDate);
    if (reservationDate < new Date()) {
      throw new BadRequestException('Reservation date must be in future');
    }

    // Check if restaurant is open
    const isOpen = this.isRestaurantOpen(restaurant, dto.reservationTime);
    if (!isOpen) {
      throw new ConflictException('Restaurant closed at this time');
    }

    // Validate menu items exist
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: dto.items.map(i => i.menuItemId) },
        restaurantId: dto.restaurantId,
        available: true,
      },
    });
    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('One or more items unavailable');
    }

    // Calculate total
    const totalAmount = dto.items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return sum + (menuItem.price * item.quantity);
    }, 0);

    // Create reservation
    const reservationCode = this.generateReservationCode();
    const reservation = await this.prisma.reservation.create({
      data: {
        reservationCode,
        userId,
        restaurantId: dto.restaurantId,
        reservationDate,
        reservationTime: dto.reservationTime,
        partySize: dto.partySize,
        specialRequests: dto.specialRequests,
        status: 'PENDING',
        items: {
          create: dto.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: menuItems.find(m => m.id === item.menuItemId).price,
            subtotal: menuItems.find(m => m.id === item.menuItemId).price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Send notifications
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.mailService.sendReservationConfirmation(user.email, reservation);
    await this.mailService.sendRestaurantNotification(restaurant.email, reservation);

    return reservation;
  }

  async getByUser(userId: string, options: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ReservationWhereInput = {
      userId,
      deletedAt: null,
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: { items: true, payment: true, restaurant: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return { data, pagination: { page, limit, total } };
  }

  async getById(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        payment: true,
        restaurant: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });

    if (!reservation || reservation.deletedAt) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async getAvailableSlots(restaurantId: string, date: string, partySize: number = 1) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // Parse opening/closing times
    const [openHour, openMin] = restaurant.openingTime.split(':').map(Number);
    const [closeHour, closeMin] = restaurant.closingTime.split(':').map(Number);

    // Generate 30-minute slots
    const slots = [];
    for (let h = openHour; h < closeHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === closeHour && m > 0) break;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }

    // Get existing reservations for date
    const existing = await this.prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate: new Date(date),
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    // Calculate available slots
    const availableSlots = slots.map(time => {
      const reservationsAtTime = existing.filter(r => r.reservationTime === time);
      const capacity = 50; // Max party size
      const booked = reservationsAtTime.reduce((sum, r) => sum + r.partySize, 0);
      const available = booked + partySize <= capacity;

      return {
        time,
        available,
        capacity: capacity - booked,
      };
    });

    return { date, availableSlots };
  }

  async confirm(id: string, userId: string) {
    const reservation = await this.getById(id);

    // Check authorization
    const isOwner = await this.isRestaurantOwner(reservation.restaurantId, userId);
    if (!isOwner && reservation.userId !== userId) {
      throw new ForbiddenException();
    }

    if (reservation.status !== 'PENDING') {
      throw new ConflictException('Reservation is not pending');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: { items: true },
    });

    // Send notification to customer
    await this.mailService.sendReservationConfirmed(reservation.user.email, updated);

    return updated;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const reservation = await this.getById(id);

    // Check authorization
    if (reservation.userId !== userId && !await this.isAdmin(userId)) {
      throw new ForbiddenException();
    }

    if (['COMPLETED', 'CANCELLED'].includes(reservation.status)) {
      throw new ConflictException('Cannot cancel completed/cancelled order');
    }

    // Refund if payment exists
    if (reservation.payment) {
      await this.refundPayment(reservation.payment.id);
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        canceledAt: new Date(),
      },
    });

    // Send notifications
    await this.mailService.sendReservationCancelled(reservation.user.email, updated, reason);

    return updated;
  }

  private isRestaurantOpen(restaurant: Restaurant, time: string): boolean {
    const [reqH, reqM] = time.split(':').map(Number);
    const [openH, openM] = restaurant.openingTime.split(':').map(Number);
    const [closeH, closeM] = restaurant.closingTime.split(':').map(Number);

    const reqMinutes = reqH * 60 + reqM;
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return reqMinutes >= openMinutes && reqMinutes < closeMinutes;
  }

  private generateReservationCode(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `AY-${year}-${random}`;
  }

  private async isRestaurantOwner(restaurantId: string, userId: string): Promise<boolean> {
    const record = await this.prisma.userRestaurant.findFirst({
      where: { restaurantId, userId, role: 'OWNER' },
    });
    return !!record;
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user?.role === 'ADMIN';
  }

  private async refundPayment(paymentId: string) {
    // Logic to refund payment
    // Update payment status to CANCELLED
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'CANCELLED' },
    });
  }
}
```

---

---

# PAYMENT MODULE

## Backend: `apps/backend/src/modules/payment`

### Payment Controller

```typescript
@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async create(@Request() req, @Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto, req.user.id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.paymentService.getById(id);
  }

  @Post(':id/upload-proof')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.paymentService.uploadProof(id, file, req.user.id);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @Roles('RESTAURANT_OWNER', 'ADMIN')
  async verify(
    @Param('id') id: string,
    @Body() dto: { verified: boolean; notes?: string },
    @Request() req,
  ) {
    return this.paymentService.verify(id, dto.verified, dto.notes, req.user.id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async complete(@Param('id') id: string) {
    return this.paymentService.complete(id);
  }
}
```

---

### Payment Service

```typescript
@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService, // MinIO/S3
    private qrService: QrService, // QR code generation
  ) {}

  async create(dto: CreatePaymentDto, userId: string) {
    // Validate reservation
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: dto.reservationId },
      include: { payment: true },
    });

    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.userId !== userId) throw new ForbiddenException();
    if (reservation.payment) throw new ConflictException('Payment already exists');

    const paymentCode = this.generatePaymentCode();

    // Calculate total from reservation items
    const totalAmount = (await this.prisma.reservationItem.aggregate({
      where: { reservationId: dto.reservationId },
      _sum: { subtotal: true },
    }))._sum.subtotal || 0;

    let qrCode = null;
    let qrExpiry = null;

    // Generate QR code if Pichincha method
    if (dto.method === 'PICHINCHA_QR') {
      const qrData = {
        amount: totalAmount,
        paymentCode,
        restaurantId: reservation.restaurantId,
      };
      qrCode = await this.qrService.generate(JSON.stringify(qrData));
      qrExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    const payment = await this.prisma.payment.create({
      data: {
        paymentCode,
        userId,
        restaurantId: reservation.restaurantId,
        reservationId: dto.reservationId,
        amount: totalAmount,
        currency: 'USD',
        method: dto.method,
        status: 'PENDING',
        qrCode,
        qrExpiry,
      },
    });

    return payment;
  }

  async getById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { reservation: true },
    });

    if (!payment || payment.deletedAt) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async uploadProof(id: string, file: Express.Multer.File, userId: string) {
    const payment = await this.getById(id);

    if (payment.userId !== userId) throw new ForbiddenException();
    if (payment.status !== 'PENDING') {
      throw new ConflictException('Payment proof already submitted');
    }

    // Validate file
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG/PNG allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new PayloadTooLargeException('File exceeds 5MB');
    }

    // Upload to storage
    const proofUrl = await this.storageService.upload(`proofs/${payment.id}.jpg`, file);

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        proofUrl,
        status: 'AWAITING_PROOF',
      },
    });

    return updated;
  }

  async verify(id: string, verified: boolean, notes?: string, userId?: string) {
    const payment = await this.getById(id);

    if (payment.status !== 'AWAITING_PROOF') {
      throw new ConflictException('Payment not awaiting verification');
    }

    const status = verified ? 'VERIFIED' : 'REJECTED';

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status,
        proofVerifiedAt: new Date(),
        notes,
      },
    });

    if (verified) {
      // Auto-confirm reservation
      await this.prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: 'CONFIRMED' },
      });
    }

    return updated;
  }

  async complete(id: string) {
    const payment = await this.getById(id);

    if (payment.status !== 'VERIFIED') {
      throw new ConflictException('Payment not verified');
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Update reservation to READY_FOR_PICKUP
    await this.prisma.reservation.update({
      where: { id: payment.reservationId },
      data: { status: 'READY_FOR_PICKUP' },
    });

    return updated;
  }

  private generatePaymentCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `PAY-${timestamp}${random}`;
  }
}
```

---

---

# FRONTEND HOOKS

## `apps/web/src/hooks`

### `useAuth.ts`

```typescript
export const useAuth = () => {
  const {
    token,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      await login(email, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (data: SignupData) => {
    try {
      await signup(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    signin,
    register,
    logout,
  };
};
```

---

### `useCart.ts`

```typescript
export const useCart = () => {
  const {
    items,
    restaurantId,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    totalItems,
    totalAmount,
  } = useCartStore();

  return {
    items,
    restaurantId,
    totalItems: totalItems(),
    totalAmount: totalAmount(),
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
};
```

---

### `useRestaurants.ts`

```typescript
export const useRestaurants = () => {
  const { restaurants, selectedRestaurant, loading, error } = useRestaurantStore();

  const fetchNearby = async (latitude: number, longitude: number) => {
    try {
      await restaurantStore.fetchNearbyRestaurants(latitude, longitude);
    } catch (error) {
      console.error('Failed to fetch nearby restaurants:', error);
    }
  };

  const selectRestaurant = async (restaurantId: string) => {
    try {
      await restaurantStore.selectRestaurant(restaurantId);
    } catch (error) {
      console.error('Failed to select restaurant:', error);
    }
  };

  return {
    restaurants,
    selectedRestaurant,
    loading,
    error,
    fetchNearby,
    selectRestaurant,
  };
};
```

---

### `useGeolocation.ts`

```typescript
export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  };

  return { location, error, loading, getLocation };
};
```

---

---

# FRONTEND SERVICES

## `apps/web/src/services`

### `api.ts` (Axios Client)

```typescript
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth & redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### `auth.service.ts`

```typescript
import apiClient from './api';

export const authService = {
  signup: (data: SignupData) =>
    apiClient.post('/auth/signup', data),

  signin: (email: string, password: string) =>
    apiClient.post('/auth/signin', { email, password }),

  getMe: () =>
    apiClient.get('/auth/me'),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post('/auth/logout'),
};
```

---

### `restaurant.service.ts`

```typescript
export const restaurantService = {
  findAll: (page = 1, limit = 10, search?: string) =>
    apiClient.get('/restaurants', { params: { page, limit, search } }),

  findNearby: (latitude: number, longitude: number, maxKm?: number) =>
    apiClient.get('/restaurants/nearby', { params: { latitude, longitude, maxKm } }),

  getById: (id: string) =>
    apiClient.get(`/restaurants/${id}`),

  getMyRestaurant: () =>
    apiClient.get('/restaurants/mine/my-restaurant'),

  create: (data: CreateRestaurantData) =>
    apiClient.post('/restaurants', data),

  update: (id: string, data: Partial<CreateRestaurantData>) =>
    apiClient.patch(`/restaurants/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/restaurants/${id}`),
};
```

---

### `reservation.service.ts`

```typescript
export const reservationService = {
  create: (data: CreateReservationData) =>
    apiClient.post('/reservations', data),

  getByUser: (page = 1, limit = 10) =>
    apiClient.get('/reservations', { params: { page, limit } }),

  getById: (id: string) =>
    apiClient.get(`/reservations/${id}`),

  getAvailableSlots: (restaurantId: string, date: string, partySize?: number) =>
    apiClient.get(`/reservations/available-slots/${restaurantId}`, {
      params: { date, partySize },
    }),

  confirm: (id: string) =>
    apiClient.patch(`/reservations/${id}/confirm`),

  cancel: (id: string, reason?: string) =>
    apiClient.patch(`/reservations/${id}/cancel`, { reason }),
};
```

---

### `payment.service.ts`

```typescript
export const paymentService = {
  create: (reservationId: string, method: string) =>
    apiClient.post('/payments', { reservationId, method }),

  getById: (id: string) =>
    apiClient.get(`/payments/${id}`),

  uploadProof: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/payments/${id}/upload-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verify: (id: string, verified: boolean, notes?: string) =>
    apiClient.patch(`/payments/${id}/verify`, { verified, notes }),

  complete: (id: string) =>
    apiClient.patch(`/payments/${id}/complete`),
};
```

---

**Fin de especificaciones de módulos** | Documento generado automáticamente para Spec-Driven Development.
