import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, ownerId: string) {
    console.log('🍽️ [RESTAURANT SERVICE] Creating restaurant for userId:', ownerId);
    console.log('🍽️ [RESTAURANT SERVICE] Restaurant data:', data);

    // Create restaurant with ownerId (for backwards compatibility)
    const restaurant = await this.prisma.restaurant.create({
      data: {
        ...data,
        ownerId
      },
    });

    console.log('✅ [RESTAURANT SERVICE] Restaurant created:', restaurant.id);

    // Create UserRestaurant association (new many-to-many relationship)
    try {
      const userRestaurant = await this.prisma.userRestaurant.create({
        data: {
          userId: ownerId,
          restaurantId: restaurant.id,
          role: 'OWNER', // User is the owner/creator
        },
      });
      console.log('✅ [RESTAURANT SERVICE] UserRestaurant association created:', userRestaurant.id);
    } catch (error: any) {
      console.error('⚠️ [RESTAURANT SERVICE] Failed to create UserRestaurant association:', error.message);
      // Don't throw - the restaurant was created successfully, this is just the association
    }

    return restaurant;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        skip,
        take: limit,
        include: { menuItems: true },
      }),
      this.prisma.restaurant.count(),
    ]);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findByOwnerId(ownerId: string) {
    console.log('🔍 [RESTAURANT SERVICE] Finding restaurant for owner:', ownerId);

    // Method 1: Try to find via new UserRestaurant association (preferred)
    const userRestaurant = await this.prisma.userRestaurant.findFirst({
      where: {
        userId: ownerId,
        role: 'OWNER', // Look for owner role
      },
      include: {
        restaurant: {
          include: { menuItems: true },
        },
      },
    });

    if (userRestaurant) {
      console.log('✅ [RESTAURANT SERVICE] Found restaurant via UserRestaurant:', userRestaurant.restaurant.id);
      return userRestaurant.restaurant;
    }

    // Method 2: Fallback to old ownerId column (for backwards compatibility)
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId },
      include: { menuItems: true },
    });

    if (restaurant) {
      console.log('✅ [RESTAURANT SERVICE] Found restaurant via ownerId (legacy):', restaurant.id);
      return restaurant;
    }

    console.error('❌ [RESTAURANT SERVICE] No restaurant found for owner:', ownerId);
    throw new NotFoundException('No restaurant found for this owner');
  }

  async findNearby(latitude: number, longitude: number, maxDistance = 5) {
    return this.prisma.restaurant.findMany({
      where: {
        AND: [
          { latitude: { gte: latitude - 0.05, lte: latitude + 0.05 } },
          { longitude: { gte: longitude - 0.05, lte: longitude + 0.05 } },
        ],
      },
      include: { menuItems: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.restaurant.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.restaurant.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
