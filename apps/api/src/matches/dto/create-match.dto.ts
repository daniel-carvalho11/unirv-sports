import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { MatchStatus } from '@prisma/client';

export class CreateMatchDto {
  @IsInt()
  tournamentSportId: number;

  @IsOptional()
  @IsInt()
  homeTeamId?: number;

  @IsOptional()
  @IsInt()
  awayTeamId?: number;

  @IsOptional()
  @IsInt()
  tableOfficialId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  stage?: string;

  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCourt?: string;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stopwatchSeconds?: number;

  @IsOptional()
  @IsInt()
  winnerTeamId?: number;
}
