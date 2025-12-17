import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { ClasseService } from 'src/classe/classe.service';
import { ClasseModule } from 'src/classe/classe.module';

@Module({
  controllers: [PlanningController],
  providers: [PlanningService],
 imports:[ClasseModule]
})
export class PlanningModule {}
