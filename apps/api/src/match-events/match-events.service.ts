import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';

@Injectable()
export class MatchEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatchEventDto: CreateMatchEventDto) {
    const { matchId, teamId, userId, ...data } = createMatchEventDto;

    return this.prisma.matchEvent.create({
      data: {
        ...data,
        match: { connect: { id: matchId } },
        ...(teamId && { team: { connect: { id: teamId } } }),
        ...(userId && { user: { connect: { id: userId } } }),
      },
      include: {
        team: { include: { athletics: true } },
        user: true,
      },
    });
  }

  findAllByMatch(matchId: number) {
    return this.prisma.matchEvent.findMany({
      where: { matchId, deletedAt: null },
      include: {
        team: { include: { athletics: true } },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.matchEvent.findFirst({
      where: { id, deletedAt: null },
      include: {
        team: { include: { athletics: true } },
        user: true,
        match: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento de partida com ID ${id} não encontrado.`);
    }

    return event;
  }

  async update(id: number, updateMatchEventDto: UpdateMatchEventDto) {
    await this.findOne(id);
    const { matchId, teamId, userId, ...data } = updateMatchEventDto;

    return this.prisma.matchEvent.update({
      where: { id },
      data: {
        ...data,
        ...(matchId && { match: { connect: { id: matchId } } }),
        ...(teamId && { team: { connect: { id: teamId } } }),
        ...(userId && { user: { connect: { id: userId } } }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.matchEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}