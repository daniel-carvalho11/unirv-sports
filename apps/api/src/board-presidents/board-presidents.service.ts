import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardPresidentDto } from './dto/create-board-president.dto';
import { UpdateBoardPresidentDto } from './dto/update-board-president.dto';

@Injectable()
export class BoardPresidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBoardPresidentDto) {
    const { athleticsId, ...data } = dto;

    return this.prisma.boardPresident.create({
      data: {
        ...data,
        athletics: { connect: { id: athleticsId } },
      },
      include: { athletics: true },
    });
  }

  findByAthletics(athleticsId: number) {
    return this.prisma.boardPresident.findMany({
      where: { athleticsId, deletedAt: null },
      orderBy: { tenureYear: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.boardPresident.findFirst({
      where: { id, deletedAt: null },
      include: { athletics: true },
    });

    if (!record) {
      throw new NotFoundException(`Presidente com ID ${id} não encontrado.`);
    }

    return record;
  }

  async update(id: number, dto: UpdateBoardPresidentDto) {
    await this.findOne(id);
    const { athleticsId, ...data } = dto;

    return this.prisma.boardPresident.update({
      where: { id },
      data: {
        ...data,
        ...(athleticsId && { athletics: { connect: { id: athleticsId } } }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.boardPresident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}