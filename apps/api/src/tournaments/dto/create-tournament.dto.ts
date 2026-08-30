import { Prisma } from '@prisma/client';

export class CreateTournamentDto implements Prisma.TournamentCreateInput {
  name: string;
  year: number; 
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}