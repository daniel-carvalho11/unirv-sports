import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { isLoginEnabled } from '../../config/env';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Com o login bloqueado nenhuma rota autenticada responde, mesmo que alguém tenha um token antigo
    if (!isLoginEnabled()) {
      throw new ForbiddenException('Plataforma em pré-lançamento: área logada indisponível.');
    }

    return super.canActivate(context);
  }
}