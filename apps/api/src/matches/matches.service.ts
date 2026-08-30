import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    const { scheduledAt, tournamentSportId, homeTeamId, awayTeamId, winnerTeamId, ...data } = createMatchDto;

    return this.prisma.match.create({
      data: {
        ...data,
        scheduledAt: new Date(scheduledAt),
        tournamentSport: { connect: { id: tournamentSportId } },
        ...(homeTeamId && { homeTeam: { connect: { id: homeTeamId } } }),
        ...(awayTeamId && { awayTeam: { connect: { id: awayTeamId } } }),
        ...(winnerTeamId && { winnerTeam: { connect: { id: winnerTeamId } } }),
      },
      include: {
        tournamentSport: {
          include: {
            sport: true,
            tournament: true,
          },
        },
        homeTeam: { include: { athletics: true } },
        awayTeam: { include: { athletics: true } },
        winnerTeam: { include: { athletics: true } },
      },
    });
  }

  findAll() {
    return this.prisma.match.findMany({
      where: { deletedAt: null },
      include: {
        tournamentSport: {
          include: {
            sport: true,
            tournament: true,
          },
        },
        homeTeam: { include: { athletics: true } },
        awayTeam: { include: { athletics: true } },
        winnerTeam: { include: { athletics: true } },
        events: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const match = await this.prisma.match.findFirst({
      where: { id, deletedAt: null },
      include: {
        tournamentSport: {
          include: {
            sport: true,
            tournament: true,
          },
        },
        homeTeam: { include: { athletics: true } },
        awayTeam: { include: { athletics: true } },
        winnerTeam: { include: { athletics: true } },
        events: {
          include: {
            user: true,
            team: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Partida com ID ${id} não encontrada.`);
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    await this.findOne(id);
    const { scheduledAt, tournamentSportId, homeTeamId, awayTeamId, winnerTeamId, ...data } = updateMatchDto;

    return this.prisma.match.update({
      where: { id },
      data: {
        ...data,
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(tournamentSportId && { tournamentSport: { connect: { id: tournamentSportId } } }),
        ...(homeTeamId && { homeTeam: { connect: { id: homeTeamId } } }),
        ...(awayTeamId && { awayTeam: { connect: { id: awayTeamId } } }),
        ...(winnerTeamId && { winnerTeam: { connect: { id: winnerTeamId } } }),
      },
      include: {
        homeTeam: { include: { athletics: true } },
        awayTeam: { include: { athletics: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.match.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}