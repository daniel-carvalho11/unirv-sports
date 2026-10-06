import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRegistrationDto {
  @IsInt()
  @IsNotEmpty()
  sportId: number;
}