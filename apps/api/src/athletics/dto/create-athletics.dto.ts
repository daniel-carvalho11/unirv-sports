import { Prisma } from '@prisma/client';

export class CreateAthleticDto implements Prisma.AthleticsCreateInput {
  name: string;
  acronym: string;
  degreeProgram: string;
  logoUrl?: string;
  colors?: string;
}