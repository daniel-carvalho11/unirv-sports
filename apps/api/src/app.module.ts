import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AthleticsModule,
    SportsModule,
    UsersModule,
    TournamentsModule,
    MatchesModule,
    MatchEventsModule,
    OlympicRankingModule,
    BoardPresidentsModule,
    TrophyConquestsModule,
    SystemSettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}