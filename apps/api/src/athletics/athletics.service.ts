import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleticDto } from './dto/create-athletics.dto';
import { UpdateAthleticDto } from './dto/update-athletics.dto';

@Injectable()
export class AthleticsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAthleticDto: CreateAthleticDto) {
    return this.prisma.athletics.create({
      data: createAthleticDto,
    });
  }

  findAll() {
    return this.prisma.athletics.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const athletic = await this.prisma.athletics.findUnique({
      where: { id },
    });

    if (!athletic) {
      throw new NotFoundException(`Atlética com ID ${id} não encontrada.`);
    }

    return athletic;
  }

  async update(id: number, updateAthleticDto: UpdateAthleticDto) {
    await this.findOne(id);

    return this.prisma.athletics.update({
      where: { id },
      data: updateAthleticDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.athletics.delete({
      where: { id },
    });
  }
}