import { Module } from '@nestjs/common';
import { HappenningService } from './happenning.service';
import { HappenningController } from './happenning.controller';

@Module({
  controllers: [HappenningController],
  providers: [HappenningService],
})
export class HappenningModule {}
