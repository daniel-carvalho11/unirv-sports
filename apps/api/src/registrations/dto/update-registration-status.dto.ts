import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { RegistrationStatus } from '@prisma/client';

export class UpdateRegistrationStatusDto {
  // O diretor só decide: aprovar ou recusar (PENDING é o estado inicial)
  @IsIn([RegistrationStatus.APPROVED, RegistrationStatus.REJECTED])
  status: RegistrationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  notes?: string;
}
