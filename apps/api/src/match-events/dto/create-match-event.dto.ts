import { MatchEventType } from '@prisma/client';

export class CreateMatchEventDto {
  matchId: number;
  teamId?: number;
  userId?: number;
  type: MatchEventType;
  recordedValue?: string;
  matchTimeSec?: number;
}