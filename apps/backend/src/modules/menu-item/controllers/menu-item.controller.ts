import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { MenuItemService } from '../services/menu-item.service';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Menu Items')
@Controller('menu-items')
export class MenuItemController {
  constructor(private service: MenuItemService) {}

  @Get('restaurant/:restaurantId')
  async getByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.service.findByRestaurant(restaurantId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() data: any) {
    const { restaurantId, ...itemData } = data;
    return this.service.create(restaurantId, itemData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
