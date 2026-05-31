import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, reservationId: string, amount: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const qrCode = `https://pichincha.com/qr/${Math.random().toString(36).substr(2, 9)}`;
    const qrExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return this.prisma.payment.create({
      data: {
        userId,
        reservationId,
        restaurantId: reservation.restaurantId,
        amount,
        method: 'PICHINCHA_QR',
        status: 'PENDING',
        qrCode,
        qrExpiry,
      },
    });
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async uploadProof(id: string, proofUrl: string) {
    return this.prisma.payment.update({
      where: { id },
      data: { proofUrl, status: 'AWAITING_PROOF' },
    });
  }

  async verify(id: string) {
    return this.prisma.payment.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedAt: new Date() },
    });
  }

  async complete(id: string) {
    return this.prisma.payment.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }
}
