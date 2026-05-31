import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async create(restaurantId: string, data: any) {
    return this.prisma.menuItem.create({ data: { ...data, restaurantId } });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.menuItem.findMany({ where: { restaurantId } });
  }

  async findById(id: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async update(id: string, data: any) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.menuItem.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
