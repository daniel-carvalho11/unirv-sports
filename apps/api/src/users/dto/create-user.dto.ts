import { Prisma } from '@prisma/client';

export class CreateUserDto implements Prisma.UserCreateInput {
  name: string;
  email: string;
  passwordHash: string; // Adicionado para satisfazer a exigência do Prisma
  cpf?: string;
  phone?: string;
  academicCode?: string;
  athleticId?: number;  // ID para conectar com a relação da Atlética
}