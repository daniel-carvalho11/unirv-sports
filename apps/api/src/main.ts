import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { corsOrigins, isLoginEnabled, jwtSecret } from './config/env';

async function bootstrap() {
  // Falha cedo se a configuração obrigatória estiver ausente
  jwtSecret();
  const origin = corsOrigins();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Render fica atrás de proxy: sem isso o rate limit enxerga o IP do proxy e não o do usuário
  app.set('trust proxy', 1);

  // Daniel: Habilita validação de DTOs em todas as requisições, importante para registro do token JWT, pois o DTO de login possui validações de campos obrigatórios e formato de e-mail
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin }); // Só o front-end configurado em CORS_ORIGIN (em dev, qualquer origem)

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend NestJS rodando na porta ${port} (login ${isLoginEnabled() ? 'liberado' : 'bloqueado'})`);
}
bootstrap();
