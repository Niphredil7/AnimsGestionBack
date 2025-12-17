import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClasseModule } from './classe/classe.module';
import { ChildModule } from './child/child.module';
import { MaterialModule } from './material/material.module';
import { CategoryMaterialModule } from './category-material/category-material.module';
import { PlanningModule } from './planning/planning.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NotificationModule } from './notification/notification.module';
import { RoomModule } from './room/room.module';
import { HappenningModule } from './happenning/happenning.module';
import { SchoolModule } from './school/school.module';

import { ActivityModule } from './activity/activity.module';
import { UserHasNotificationModule } from './user-has-notification/user-has-notification.module';
import { OutingModule } from './outing/outing.module';
import { PlanningActivityModule } from './planning-activity/planning-activity.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ClasseModule,
    ChildModule,
    MaterialModule,
    CategoryMaterialModule,
    PlanningModule,
    FeedbackModule,
    NotificationModule,
    RoomModule,
    HappenningModule,
    SchoolModule,
    ActivityModule,
    UserHasNotificationModule,
    OutingModule,
    PlanningActivityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
