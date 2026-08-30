import { MatchStatus } from '@prisma/client';

export class CreateMatchDto {
  tournamentSportId: number;
  homeTeamId?: number;
  awayTeamId?: number;
  stage?: string;
  scheduledAt: Date;
  locationCourt?: string;
  status?: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  stopwatchSeconds?: number;
  winnerTeamId?: number;
}