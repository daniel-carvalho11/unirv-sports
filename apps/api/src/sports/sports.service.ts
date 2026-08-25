import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(createSportDto: CreateSportDto) {
    return this.prisma.sport.upsert({
      where: {
        name: createSportDto.name,
      },
      update: {
        gender: createSportDto.gender,
        type: createSportDto.type,
        iconUrl: createSportDto.iconUrl,
        shortDesc: createSportDto.shortDesc,
        deletedAt: null, 
      },
      create: createSportDto,
    });
  }

  findAll() {
    return this.prisma.sport.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const sport = await this.prisma.sport.findFirst({
      where: { id, deletedAt: null },
    });

    if (!sport) {
      throw new NotFoundException(`Modalidade com ID ${id} não encontrada.`);
    }

    return sport;
  }

  async update(id: number, updateSportDto: UpdateSportDto) {
    await this.findOne(id);

    return this.prisma.sport.update({
      where: { id },
      data: updateSportDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.sport.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}