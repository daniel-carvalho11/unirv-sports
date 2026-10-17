import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateOlympicRankingDto {
  @IsInt()
  tournamentId: number;

  @IsInt()
  athleticsId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goldCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  silverCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bronzeCount?: number;
}
