import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchLiveService } from './live/match-live.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MatchesController],
  providers: [MatchesService, MatchLiveService],
})
export class MatchesModule {}