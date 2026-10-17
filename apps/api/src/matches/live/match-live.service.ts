import { BadRequestException, ForbiddenException, Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { Match, MatchEventType, MatchStatus, Prisma, SportType, UserRole } from '@prisma/client';
import { Observable, Subject, map } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { elapsedSeconds, setsWon, withClock } from './match-clock';
import { ClockAction, MatchLiveEventDto, MatchScoreDto, MatchSide } from './match-live.dto';

interface AuthUser {
  id: number;
  role: UserRole;
}

const liveInclude = {
  tournamentSport: { include: { sport: true, tournament: true } },
  homeTeam: { include: { athletics: true } },
  awayTeam: { include: { athletics: true } },
  winnerTeam: { include: { athletics: true } },
  events: {
    where: { deletedAt: null },
    include: { team: { include: { athletics: true } }, user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.MatchInclude;

type LiveMatch = Prisma.MatchGetPayload<{ include: typeof liveInclude }>;

@Injectable()
export class MatchLiveService {
  // Canal em memória: cada alteração feita pela mesa é empurrada para quem está assistindo via SSE
  private readonly updates$ = new Subject<ReturnType<typeof withClock<LiveMatch>>>();

  constructor(private readonly prisma: PrismaService) {}

  stream(): Observable<MessageEvent> {
    return this.updates$.pipe(map((match) => ({ type: 'match-update', data: match })));
  }

  async findOfficiating(userId: number) {
    const matches = await this.prisma.match.findMany({
      where: { tableOfficialId: userId, deletedAt: null, status: { not: MatchStatus.CANCELED } },
      include: liveInclude,
      orderBy: { scheduledAt: 'asc' },
    });
    return matches.map(withClock);
  }

  async findLive(id: number) {
    return withClock(await this.load(id));
  }

  async clock(id: number, user: AuthUser, action: ClockAction) {
    const match = await this.loadForControl(id, user);
    const now = new Date();

    if (match.status === MatchStatus.FINISHED || match.status === MatchStatus.CANCELED) {
      throw new BadRequestException('A partida já foi encerrada.');
    }

    let data: Prisma.MatchUncheckedUpdateInput;

    switch (action) {
      case 'START':
        if (match.clockRunningSince) return this.publish(id);
        data = {
          status: MatchStatus.IN_PROGRESS,
          startedAt: match.startedAt ?? now,
          clockRunningSince: now,
        };
        break;

      case 'PAUSE':
        if (!match.clockRunningSince) return this.publish(id);
        data = { stopwatchSeconds: elapsedSeconds(match, now), clockRunningSince: null };
        break;

      case 'FINISH': {
        if (match.status !== MatchStatus.IN_PROGRESS) {
          throw new BadRequestException('Só é possível encerrar uma partida em andamento.');
        }
        data = {
          status: MatchStatus.FINISHED,
          endedAt: now,
          stopwatchSeconds: elapsedSeconds(match, now),
          clockRunningSince: null,
          winnerTeamId: this.resolveWinner(match),
        };
        break;
      }
    }

    await this.prisma.match.update({ where: { id }, data });
    return this.publish(id);
  }

  async score(id: number, user: AuthUser, dto: MatchScoreDto) {
    const match = await this.loadForControl(id, user);
    this.ensureInProgress(match);

    const teamId = this.teamIdFor(match, dto.side);
    const field = dto.side === 'HOME' ? 'homeScore' : 'awayScore';
    const nextScore = match[field] + dto.points;

    if (nextScore < 0) {
      throw new BadRequestException('O placar não pode ficar negativo.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.match.update({ where: { id }, data: { [field]: nextScore } });

      if (dto.points > 0) {
        await tx.matchEvent.create({
          data: {
            matchId: id,
            teamId,
            type: MatchEventType.GOAL_POINT,
            recordedValue: `+${dto.points}`,
            matchTimeSec: elapsedSeconds(match),
          },
        });
        return;
      }

      // Correção: remove (soft delete) o último lançamento de ponto daquela equipe
      const lastPoint = match.events.find((e) => e.type === MatchEventType.GOAL_POINT && e.teamId === teamId);
      if (lastPoint) {
        await tx.matchEvent.update({ where: { id: lastPoint.id }, data: { deletedAt: new Date() } });
      }
    });

    return this.publish(id);
  }

  async registerEvent(id: number, user: AuthUser, dto: MatchLiveEventDto) {
    const match = await this.loadForControl(id, user);
    this.ensureInProgress(match);

    await this.prisma.matchEvent.create({
      data: {
        matchId: id,
        teamId: this.teamIdFor(match, dto.side),
        userId: dto.userId,
        type: dto.type,
        matchTimeSec: elapsedSeconds(match),
      },
    });

    return this.publish(id);
  }

  // Modalidades por sets (vôlei, beach tennis): fecha o set atual, registra a parcial e zera o placar de pontos
  async closeSet(id: number, user: AuthUser) {
    const match = await this.loadForControl(id, user);
    this.ensureInProgress(match);

    if (match.tournamentSport.sport.type !== SportType.SETS_PARTIALS) {
      throw new BadRequestException('Esta modalidade não é disputada em sets.');
    }
    if (match.homeScore === match.awayScore) {
      throw new BadRequestException('Não é possível fechar um set empatado.');
    }

    const winnerSide: MatchSide = match.homeScore > match.awayScore ? 'HOME' : 'AWAY';

    await this.prisma.$transaction([
      this.prisma.matchEvent.create({
        data: {
          matchId: id,
          teamId: this.teamIdFor(match, winnerSide),
          type: MatchEventType.SET_PARTIAL,
          recordedValue: `${match.homeScore}x${match.awayScore}`,
          matchTimeSec: elapsedSeconds(match),
        },
      }),
      this.prisma.match.update({ where: { id }, data: { homeScore: 0, awayScore: 0 } }),
    ]);

    return this.publish(id);
  }

  private async publish(id: number) {
    const match = withClock(await this.load(id));
    this.updates$.next(match);
    return match;
  }

  private async load(id: number) {
    const match = await this.prisma.match.findFirst({ where: { id, deletedAt: null }, include: liveInclude });
    if (!match) {
      throw new NotFoundException(`Partida com ID ${id} não encontrada.`);
    }
    return match;
  }

  // Só o mesário escalado para a partida (ou um ADMIN) controla placar e cronômetro
  private async loadForControl(id: number, user: AuthUser) {
    const match = await this.load(id);
    if (user.role !== UserRole.ADMIN && match.tableOfficialId !== user.id) {
      throw new ForbiddenException('Você não é o oficial de mesa desta partida.');
    }
    return match;
  }

  private ensureInProgress(match: Match) {
    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new BadRequestException('Inicie a partida antes de registrar lances.');
    }
  }

  private teamIdFor(match: Match, side: MatchSide) {
    const teamId = side === 'HOME' ? match.homeTeamId : match.awayTeamId;
    if (!teamId) {
      throw new BadRequestException('Equipe ainda não definida para esta partida.');
    }
    return teamId;
  }

  private resolveWinner(match: LiveMatch) {
    const isSets = match.tournamentSport.sport.type === SportType.SETS_PARTIALS;
    const sets = setsWon(match);
    const home = isSets ? sets.home : match.homeScore;
    const away = isSets ? sets.away : match.awayScore;

    if (home === away) return null; // empate
    return home > away ? match.homeTeamId : match.awayTeamId;
  }
}
