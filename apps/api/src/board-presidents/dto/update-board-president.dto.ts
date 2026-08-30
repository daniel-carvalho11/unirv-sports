import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardPresidentDto } from './create-board-president.dto';

export class UpdateBoardPresidentDto extends PartialType(CreateBoardPresidentDto) {}
