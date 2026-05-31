import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', database: 'connected', timestamp: new Date() };
    } catch (error: any) {
      return { status: 'unhealthy', database: 'disconnected', timestamp: new Date(), errorMessage: error?.message };
    }
  }
}
