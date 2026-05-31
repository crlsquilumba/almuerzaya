import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ReservationService } from '../services/reservation.service';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private service: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() data: any, @Request() req: ExpressRequest & { user?: { userId: string } }) {
    return this.service.create(req.user?.userId || '', data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserReservations(@Request() req: ExpressRequest & { user?: { userId: string } }) {
    return this.service.findUserReservations(req.user?.userId || '');
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('available-slots/:restaurantId')
  async getAvailableSlots(@Param('restaurantId') restaurantId: string, @Query('date') date: string) {
    return this.service.getAvailableSlots(restaurantId, date);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
