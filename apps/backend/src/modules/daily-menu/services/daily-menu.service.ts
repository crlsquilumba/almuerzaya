import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../shared/database/prisma.service';

export interface CreateDailyMenuDto {
  nombre: string;
  imagen?: string;
  price?: number;
  sopaName: string;
  sopaExtras?: string;
  proteinaName: string;
  guarniciones?: string;
  ensalada?: string;
  bebida?: string;
  postre?: string;
  isActive?: boolean;
}

export interface UpdateDailyMenuDto {
  nombre?: string;
  imagen?: string;
  price?: number;
  sopaName?: string;
  sopaExtras?: string;
  proteinaName?: string;
  guarniciones?: string;
  ensalada?: string;
  bebida?: string;
  postre?: string;
  isActive?: boolean;
}

@Injectable()
export class DailyMenuService {
  constructor(private prisma: PrismaService) {}

  async create(restaurantId: string, data: CreateDailyMenuDto) {
    // ✅ Convertir price a Decimal (para dinero con 2 decimales)
    const cleanData = {
      ...data,
      price: data.price !== undefined
        ? new Decimal(typeof data.price === 'string' ? data.price : data.price.toString())
        : undefined,
    };

    // Deactivate other menus for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.dailyMenu.updateMany({
      where: {
        restaurantId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      data: { isActive: false },
    });

    // Create new daily menu
    return this.prisma.dailyMenu.create({
      data: {
        ...cleanData,
        restaurantId,
        date: new Date(),
      },
    });
  }

  async update(id: string, restaurantId: string, data: UpdateDailyMenuDto) {
    // ✅ Convertir price a Decimal (para dinero con 2 decimales)
    const cleanData = {
      ...data,
      price: data.price !== undefined
        ? new Decimal(typeof data.price === 'string' ? data.price : data.price.toString())
        : undefined,
    };

    return this.prisma.dailyMenu.update({
      where: { id },
      data: cleanData,
    });
  }

  async findByRestaurant(restaurantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.dailyMenu.findMany({
      where: {
        restaurantId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.dailyMenu.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.dailyMenu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async activateTodayMenu(restaurantId: string, menuId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Deactivate all other menus for today
    await this.prisma.dailyMenu.updateMany({
      where: {
        restaurantId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      data: { isActive: false },
    });

    // Activate this menu
    return this.prisma.dailyMenu.update({
      where: { id: menuId },
      data: { isActive: true },
    });
  }
}
