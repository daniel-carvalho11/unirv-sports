import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const { startDate, endDate, ...data } = createTournamentDto;

    return this.prisma.tournament.create({
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
  }

  findAll() {
    return this.prisma.tournament.findMany({
      where: { deletedAt: null },
      include: {
        sports: {
          include: {
            sport: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const tournament = await this.prisma.tournament.findFirst({
      where: { id, deletedAt: null },
      include: {
        sports: {
          include: {
            sport: true,
          },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Torneio com ID ${id} não encontrado.`);
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    await this.findOne(id);
    const { startDate, endDate, ...data } = updateTournamentDto;

    return this.prisma.tournament.update({
      where: { id },
      data: {
        ...data,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tournament.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}