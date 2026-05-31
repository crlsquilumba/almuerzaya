import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Almuerza Ya API v2.0 - Professional Backend with NestJS + PostgreSQL/Supabase';
  }
}
