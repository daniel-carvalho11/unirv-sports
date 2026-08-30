import { Module } from '@nestjs/common';
import { BoardPresidentsService } from './board-presidents.service';
import { BoardPresidentsController } from './board-presidents.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BoardPresidentsController],
  providers: [BoardPresidentsService],
})
export class BoardPresidentsModule {}
