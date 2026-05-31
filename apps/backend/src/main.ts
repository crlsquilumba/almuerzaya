import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  logger.log('🚀 Iniciando Almuerza Ya Backend...');

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  logger.log('✅ Pipes de validación configurados');

  // Exception Filters
  app.useGlobalFilters(new HttpExceptionFilter());
  logger.log('✅ Filtros de excepciones configurados');

  // CORS
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(',');
  app.enableCors({ origin: origins, credentials: true });
  logger.log(`✅ CORS habilitado para: ${origins.join(', ')}`);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Almuerza Ya API v2')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);
  logger.log('✅ Swagger/OpenAPI documentación configurada');

  app.setGlobalPrefix('/api/v1');
  logger.log('✅ Global prefix /api/v1 configurado');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🌐 Servidor escuchando en http://localhost:${port}`);
  logger.log(`📚 Documentación en http://localhost:${port}/api/v1/docs`);
  logger.log(`❤️ Health check en http://localhost:${port}/api/v1/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Error iniciando aplicación:', error);
  process.exit(1);
});
