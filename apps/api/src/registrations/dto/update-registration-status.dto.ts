import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RegistrationStatus } from '@prisma/client';

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus)
  status: RegistrationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}