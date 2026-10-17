import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Prisma, SportGender, SportType } from '@prisma/client';

export class CreateSportDto implements Prisma.SportCreateInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum(SportGender)
  gender: SportGender;

  @IsEnum(SportType)
  type: SportType;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  shortDesc?: string;
}
