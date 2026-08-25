import { Module } from '@nestjs/common';
import { AthleticsService } from './athletics.service';
import { AthleticsController } from './athletics.controller';

@Module({
  controllers: [AthleticsController],
  providers: [AthleticsService],
})
export class AthleticsModule {}
