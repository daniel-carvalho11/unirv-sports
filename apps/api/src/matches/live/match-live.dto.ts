import { IsIn, IsInt, IsOptional, Max, Min, NotEquals } from 'class-validator';
import { MatchEventType } from '@prisma/client';

export const MATCH_SIDES = ['HOME', 'AWAY'] as const;
export type MatchSide = (typeof MATCH_SIDES)[number];

export const CLOCK_ACTIONS = ['START', 'PAUSE', 'FINISH'] as const;
export type ClockAction = (typeof CLOCK_ACTIONS)[number];

export const LIVE_EVENT_TYPES = [MatchEventType.FOUL, MatchEventType.YELLOW_CARD, MatchEventType.RED_CARD] as const;

export class MatchClockDto {
  @IsIn(CLOCK_ACTIONS)
  action: ClockAction;
}

export class MatchScoreDto {
  @IsIn(MATCH_SIDES)
  side: MatchSide;

  // Positivo marca ponto/gol; negativo corrige um lançamento errado
  @IsInt()
  @Min(-3)
  @Max(3)
  @NotEquals(0)
  points: number;
}

export class MatchLiveEventDto {
  @IsIn(MATCH_SIDES)
  side: MatchSide;

  @IsIn(LIVE_EVENT_TYPES)
  type: (typeof LIVE_EVENT_TYPES)[number];

  @IsOptional()
  @IsInt()
  userId?: number;
}
