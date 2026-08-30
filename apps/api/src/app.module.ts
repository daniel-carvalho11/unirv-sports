import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleticsModule } from './athletics/athletics.module';
import { SportsModule } from './sports/sports.module';
import { UsersModule } from './users/users.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { MatchEventsModule } from './match-events/match-events.module';
import { OlympicRankingModule } from './olympic-ranking/olympic-ranking.module';

@Module({
  imports: [PrismaModule, AthleticsModule, SportsModule, UsersModule, TournamentsModule, MatchesModule, MatchEventsModule, OlympicRankingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}