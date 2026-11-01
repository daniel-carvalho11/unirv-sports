import { Controller, Post, Body, Get, Request, ForbiddenException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { isLoginEnabled } from '../config/env';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } }) // Freia tentativa de senha por força bruta
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // Pré-lançamento: só cadastro. Liberar com LOGIN_ENABLED=true quando o contador zerar
    if (!isLoginEnabled()) {
      throw new ForbiddenException('O login será liberado no lançamento da plataforma. Por enquanto, apenas cadastros.');
    }
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}