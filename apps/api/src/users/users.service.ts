import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { athleticsId, password, ...userData } = createUserDto;

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
        ...(athleticsId && {
          athletics: { connect: { id: Number(athleticsId) } },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        athletics: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        athletics: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        athletics: true,
      },
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
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}