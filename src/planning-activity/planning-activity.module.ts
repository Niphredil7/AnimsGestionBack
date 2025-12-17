import { Module } from '@nestjs/common';
import { PlanningActivityService } from './planning-activity.service';
import { PlanningActivityController } from './planning-activity.controller';
import { ClasseModule } from 'src/classe/classe.module';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [PlanningActivityController],
  providers: [PlanningActivityService],
  imports:[ClasseModule, NotificationModule]
})
export class PlanningActivityModule {}
