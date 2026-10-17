import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTrophyConquestDto {
  @IsInt()
  athleticsId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  iconType?: string;
}
