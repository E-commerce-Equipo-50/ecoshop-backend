import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get<string>('app.apiPrefix') || 'api');
  
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
  
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
