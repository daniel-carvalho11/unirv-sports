import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateAthleticDto implements Prisma.AthleticsCreateInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  acronym: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  degreeProgram: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsInt()
  foundationYear?: number;

  @IsOptional()
  @IsString()
  historyMission?: string;
}
