import { PartialType } from '@nestjs/mapped-types';
import { CreateAthleticDto } from './create-athletics.dto';

export class UpdateAthleticDto extends PartialType(CreateAthleticDto) {}