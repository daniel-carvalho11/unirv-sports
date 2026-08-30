import { Module } from '@nestjs/common';
import { TrophyConquestsService } from './trophy-conquests.service';
import { TrophyConquestsController } from './trophy-conquests.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrophyConquestsController],
  providers: [TrophyConquestsService],
})
export class TrophyConquestsModule {}
