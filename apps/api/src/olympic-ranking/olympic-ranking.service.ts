import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOlympicRankingDto } from './dto/create-olympic-ranking.dto';
import { UpdateOlympicRankingDto } from './dto/update-olympic-ranking.dto';

@Injectable()
export class OlympicRankingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: CreateOlympicRankingDto) {
    const { tournamentId, athleticsId, totalPoints = 0, goldCount = 0, silverCount = 0, bronzeCount = 0 } = dto;

    return this.prisma.olympicRanking.upsert({
      where: {
        tournamentId_athleticsId: {
          tournamentId,
          athleticsId,
        },
      },
      update: {
        totalPoints,
        goldCount,
        silverCount,
        bronzeCount,
        deletedAt: null,
      },
      create: {
        tournament: { connect: { id: tournamentId } },
        athletics: { connect: { id: athleticsId } },
        totalPoints,
        goldCount,
        silverCount,
        bronzeCount,
      },
      include: {
        athletics: true,
        tournament: true,
      },
    });
  }

  findByTournament(tournamentId: number) {
    return this.prisma.olympicRanking.findMany({
      where: { tournamentId, deletedAt: null },
      include: { athletics: true },
      orderBy: [
        { totalPoints: 'desc' },
        { goldCount: 'desc' },
        { silverCount: 'desc' },
        { bronzeCount: 'desc' },
      ],
    });
  }

  async findOne(id: number) {
    const ranking = await this.prisma.olympicRanking.findFirst({
      where: { id, deletedAt: null },
      include: { athletics: true, tournament: true },
    });

    if (!ranking) {
      throw new NotFoundException(`Registro de ranking com ID ${id} não encontrado.`);
    }

    return ranking;
  }

  async update(id: number, updateOlympicRankingDto: UpdateOlympicRankingDto) {
    await this.findOne(id);

    return this.prisma.olympicRanking.update({
      where: { id },
      data: updateOlympicRankingDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.olympicRanking.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}