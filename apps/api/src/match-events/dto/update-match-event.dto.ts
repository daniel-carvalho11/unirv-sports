import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchEventDto } from './create-match-event.dto';

export class UpdateMatchEventDto extends PartialType(CreateMatchEventDto) {}
