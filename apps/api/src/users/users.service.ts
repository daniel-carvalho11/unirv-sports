import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto, PUBLIC_SIGNUP_ROLES } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  // Nunca devolver o hash da senha nas respostas da API
  private readonly publicSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    cpf: true,
    academicId: true,
    photoUrl: true,
    athleticsId: true,
    createdAt: true,
    athletics: true,
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(registerUserDto: RegisterUserDto) {
    const { athleticsId, password, ...userData } = registerUserDto;

    // Segunda barreira além do DTO: o cadastro público nunca cria perfis com poder de aprovação ou de mesa
    if (!(PUBLIC_SIGNUP_ROLES as readonly UserRole[]).includes(userData.role)) {
      throw new ForbiddenException('Este perfil não pode ser criado pelo cadastro público.');
    }

    const needsAthletics = userData.role === UserRole.ATHLETE;
    if (needsAthletics && !athleticsId) {
      throw new BadRequestException('Atletas precisam selecionar uma atlética.');
    }

    if (needsAthletics) {
      const athletics = await this.prisma.athletics.findFirst({ where: { id: athleticsId, deletedAt: null } });
      if (!athletics) {
        throw new BadRequestException('Atlética não encontrada.');
      }
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
          passwordHash,
          ...(needsAthletics && {
            athletics: { connect: { id: Number(athleticsId) } },
          }),
        },
        select: this.publicSelect,
      });
    } catch (error) {
      // Dois cadastros simultâneos com o mesmo e-mail passam pela checagem acima; o índice único barra o segundo
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: this.publicSelect,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: this.publicSelect,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const { athleticsId, password, ...userData } = updateUserDto;

    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(passwordHash && { passwordHash }),
        ...(athleticsId && {
          athletics: { connect: { id: Number(athleticsId) } },
        }),
      },
      select: this.publicSelect,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: this.publicSelect,
    });
  }
}