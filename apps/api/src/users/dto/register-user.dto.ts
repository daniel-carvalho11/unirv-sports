import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

// Perfis que qualquer pessoa pode criar sozinha. Diretor, mesário e admin são definidos pelo ADMIN (PATCH /users/:id),
// senão qualquer um se cadastraria como diretor de uma atlética e aprovaria inscrições dela
export const PUBLIC_SIGNUP_ROLES = [UserRole.VISITOR, UserRole.ATHLETE] as const;

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class RegisterUserDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' }) // bcrypt ignora o que passa de 72 bytes
  password: string;

  @IsIn(PUBLIC_SIGNUP_ROLES, { message: 'Perfil inválido para cadastro.' })
  role: (typeof PUBLIC_SIGNUP_ROLES)[number];

  @IsOptional()
  @IsInt()
  athleticsId?: number;
}
