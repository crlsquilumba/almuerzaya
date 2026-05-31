import { Module } from '@nestjs/common';
import { MenuItemService } from './services/menu-item.service';
import { MenuItemController } from './controllers/menu-item.controller';
import { DatabaseModule } from '../../shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MenuItemService],
  controllers: [MenuItemController],
  exports: [MenuItemService],
})
export class MenuItemModule {}
