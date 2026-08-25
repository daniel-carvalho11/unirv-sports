import { Prisma, SportGender, SportType } from '@prisma/client';

export class CreateSportDto implements Prisma.SportCreateInput {
  name: string;
  gender: SportGender;
  type: SportType;
  iconUrl?: string;
  shortDesc?: string;
}