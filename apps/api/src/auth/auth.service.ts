import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { athletics: true },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { athletics: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const { passwordHash, ...result } = user;
    return result;
  }
}