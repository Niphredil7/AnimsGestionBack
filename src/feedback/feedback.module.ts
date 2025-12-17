import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { ActivityService } from 'src/activity/activity.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, ActivityService],
})
export class FeedbackModule {}
