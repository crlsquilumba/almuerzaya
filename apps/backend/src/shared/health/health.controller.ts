import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private service: HealthService) {}

  @Get()
  @HttpCode(200)
  async check() {
    return this.service.checkHealth();
  }

  @Get('live')
  @HttpCode(200)
  async live() {
    return { status: 'alive', timestamp: new Date() };
  }

  @Get('ready')
  @HttpCode(200)
  async ready() {
    return this.service.checkHealth();
  }
}
