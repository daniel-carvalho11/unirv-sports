import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  async create(createUserDto: CreateUserDto) {
    const { athleticsId, password, ...userData } = createUserDto;

    if (userData.role === UserRole.ADMIN) {
      throw new ForbiddenException('Não é permitido criar administradores pelo cadastro público.');
    }

    const needsAthletics = userData.role === UserRole.ATHLETE || userData.role === UserRole.REPRESENTATIVE;
    if (needsAthletics && !athleticsId) {
      throw new BadRequestException('Atletas e diretores precisam selecionar uma atlética.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        ...(needsAthletics && {
          athletics: { connect: { id: Number(athleticsId) } },
        }),
      },
      select: this.publicSelect,
    });
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