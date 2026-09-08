import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Daniel: Habilita validação de DTOs em todas as requisições, importante para registro do token JWT, pois o DTO de login possui validações de campos obrigatórios e formato de e-mail
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(); // Permite requisições do Front-end React/Next.js

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();