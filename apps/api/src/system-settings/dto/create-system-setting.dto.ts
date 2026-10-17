import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSystemSettingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  key: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  message?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
