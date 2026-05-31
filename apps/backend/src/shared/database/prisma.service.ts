import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    this.logger.log('🔗 [DATABASE] Conectando a Supabase PostgreSQL...');
    try {
      await this.$connect();
      this.logger.log('✅ [DATABASE] Conexión a Supabase exitosa');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ [DATABASE] Error conectando a Supabase: ${errorMessage}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('🔌 [DATABASE] Desconectando de Supabase...');
    await this.$disconnect();
    this.logger.log('✅ [DATABASE] Desconectado de Supabase');
  }
}
