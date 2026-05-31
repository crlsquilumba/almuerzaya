import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: data.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.reservation.create({
      data: {
        ...data,
        userId,
        items: {
          create: data.items || [],
        },
      },
      include: { items: true },
    });
  }

  async findById(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async findUserReservations(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { items: true, restaurant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirm(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
  }

  async cancel(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED', canceledAt: new Date() },
    });
  }

  async getAvailableSlots(restaurantId: string, date: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate: new Date(date),
        status: { not: 'CANCELLED' },
      },
    });

    const slots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00'];
    const bookedSlots = reservations.map((r) => r.reservationTime);
    return slots.filter((slot) => !bookedSlots.includes(slot));
  }
}
