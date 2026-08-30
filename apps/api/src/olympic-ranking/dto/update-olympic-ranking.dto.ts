import { PartialType } from '@nestjs/mapped-types';
import { CreateOlympicRankingDto } from './create-olympic-ranking.dto';

export class UpdateOlympicRankingDto extends PartialType(CreateOlympicRankingDto) {}
