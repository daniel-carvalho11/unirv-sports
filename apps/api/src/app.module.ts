import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleticsModule } from './athletics/athletics.module';
import { SportsModule } from './sports/sports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AthleticsModule, SportsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}