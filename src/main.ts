import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: configService.get<string>('app.cors.origin') || '*',
    credentials: configService.get<boolean>('app.cors.credentials') || true,
    optionsSuccessStatus: 200,
  });

  // Establecer el prefijo global ANTES de configurar Swagger
  app.setGlobalPrefix(configService.get<string>('app.apiPrefix') || 'api', {
    exclude: ['health'],
  });

  // Configurar Swagger DESPUÉS del prefijo global
  const swaggerConf = configService.get('swagger');
  const config = new DocumentBuilder()
    .setTitle(swaggerConf.title)
    .setDescription(swaggerConf.description)
    .setVersion(swaggerConf.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConf.path, app, document, swaggerConf.options);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
