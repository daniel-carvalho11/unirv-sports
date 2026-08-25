import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleticsModule } from './athletics/athletics.module';

@Module({
  imports: [PrismaModule, AthleticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}