import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request as ExpressRequest, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { DailyMenuService, CreateDailyMenuDto, UpdateDailyMenuDto } from '../services/daily-menu.service';
import { Request } from 'express';

@Controller('daily-menus')
export class DailyMenuController {
  constructor(private dailyMenuService: DailyMenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateDailyMenuDto & { restaurantId: string },
  ) {
    const { restaurantId, ...data } = body;

    if (!restaurantId) {
      throw new BadRequestException('restaurantId is required in request body');
    }

    return this.dailyMenuService.create(restaurantId, data as CreateDailyMenuDto);
  }

  @Get(':restaurantId')
  async getByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.dailyMenuService.findByRestaurant(restaurantId);
  }

  @Get(':id/detail')
  async getById(@Param('id') id: string) {
    return this.dailyMenuService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId: string } },
    @Body() data: UpdateDailyMenuDto,
  ) {
    const restaurantId = req.body.restaurantId;
    return this.dailyMenuService.update(id, restaurantId, data);
  }

  @Put(':id/activate')
  @UseGuards(JwtAuthGuard)
  async activate(
    @Param('id') id: string,
    @Req() req: Request & { user?: { userId: string } },
    @Body('restaurantId') restaurantId: string,
  ) {
    return this.dailyMenuService.activateTodayMenu(restaurantId, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.dailyMenuService.delete(id);
  }
}
