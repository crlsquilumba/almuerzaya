import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private service: RestaurantService) {}

  @Get('mine/my-restaurant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyRestaurant(@Request() req: ExpressRequest & { user?: { userId: string } }) {
    console.log('🔍 [RESTAURANT CONTROLLER] Getting restaurant for user:', req.user?.userId);
    return this.service.findByOwnerId(req.user?.userId || '');
  }

  @Get()
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get('nearby')
  async getNearby(@Query('latitude') lat: number, @Query('longitude') lng: number) {
    return this.service.findNearby(Number(lat), Number(lng));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() data: any, @Request() req: ExpressRequest & { user?: { userId: string } }) {
    return this.service.create(data, req.user?.userId || '');
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
