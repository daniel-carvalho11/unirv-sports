import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { MatchEventType } from '@prisma/client';

export class CreateMatchEventDto {
  @IsInt()
  matchId: number;

  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsEnum(MatchEventType)
  type: MatchEventType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  recordedValue?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  matchTimeSec?: number;
}
