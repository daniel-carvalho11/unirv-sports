import { Prisma } from '@prisma/client';

export class CreateUserDto implements Omit<Prisma.UserCreateInput, 'passwordHash'> {
  name: string;
  email: string;
  password: string; 
  cpf?: string;
  phone?: string;
  academicCode?: string;
  athleticId?: number;
}