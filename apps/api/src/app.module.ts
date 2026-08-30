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
import { BoardPresidentsModule } from './board-presidents/board-presidents.module';
import { TrophyConquestsModule } from './trophy-conquests/trophy-conquests.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';

@Module({
  imports: [PrismaModule, AthleticsModule, SportsModule, UsersModule, TournamentsModule, MatchesModule, MatchEventsModule, OlympicRankingModule, BoardPresidentsModule, TrophyConquestsModule, SystemSettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}