import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() data: { reservationId: string; amount: number }, @Request() req: ExpressRequest & { user?: { userId: string } }) {
    return this.service.create(req.user?.userId || '', data.reservationId, data.amount);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id/upload-proof')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadProof(@Param('id') id: string, @Body() data: { proofUrl: string }) {
    return this.service.uploadProof(id, data.proofUrl);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async verify(@Param('id') id: string) {
    return this.service.verify(id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async complete(@Param('id') id: string) {
    return this.service.complete(id);
  }
}
