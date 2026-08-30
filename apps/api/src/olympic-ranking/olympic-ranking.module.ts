import { Module } from '@nestjs/common';
import { OlympicRankingService } from './olympic-ranking.service';
import { OlympicRankingController } from './olympic-ranking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OlympicRankingController],
  providers: [OlympicRankingService],
})
export class OlympicRankingModule {}