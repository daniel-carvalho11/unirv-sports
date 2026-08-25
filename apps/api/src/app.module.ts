import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleticsModule } from './athletics/athletics.module';
import { SportsModule } from './sports/sports.module';

@Module({
  imports: [PrismaModule, AthleticsModule, SportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}