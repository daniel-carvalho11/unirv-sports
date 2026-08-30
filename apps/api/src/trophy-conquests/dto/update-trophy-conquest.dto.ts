import { PartialType } from '@nestjs/mapped-types';
import { CreateTrophyConquestDto } from './create-trophy-conquest.dto';

export class UpdateTrophyConquestDto extends PartialType(CreateTrophyConquestDto) {}
