import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrophyConquestDto } from './dto/create-trophy-conquest.dto';
import { UpdateTrophyConquestDto } from './dto/update-trophy-conquest.dto';

@Injectable()
export class TrophyConquestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrophyConquestDto) {
    const { athleticsId, ...data } = dto;

    return this.prisma.trophyConquest.create({
      data: {
        ...data,
        athletics: { connect: { id: athleticsId } },
      },
      include: { athletics: true },
    });
  }

  findByAthletics(athleticsId: number) {
    return this.prisma.trophyConquest.findMany({
      where: { athleticsId, deletedAt: null },
      orderBy: { year: 'desc' },
    });
  }

  async findOne(id: number) {
    const trophy = await this.prisma.trophyConquest.findFirst({
      where: { id, deletedAt: null },
      include: { athletics: true },
    });

    if (!trophy) {
      throw new NotFoundException(`Conquista/Troféu com ID ${id} não encontrado.`);
    }

    return trophy;
  }

  async update(id: number, dto: UpdateTrophyConquestDto) {
    await this.findOne(id);
    const { athleticsId, ...data } = dto;

    return this.prisma.trophyConquest.update({
      where: { id },
      data: {
        ...data,
        ...(athleticsId && { athletics: { connect: { id: athleticsId } } }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.trophyConquest.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}