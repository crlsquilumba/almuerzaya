import { Module } from '@nestjs/common';
import { DailyMenuService } from './services/daily-menu.service';
import { DailyMenuController } from './controllers/daily-menu.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../shared/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [DailyMenuController],
  providers: [DailyMenuService, PrismaService],
  exports: [DailyMenuService],
})
export class DailyMenuModule {}
