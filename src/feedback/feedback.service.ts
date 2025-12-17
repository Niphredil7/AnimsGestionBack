import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Favorite, Feedback } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityService } from 'src/activity/activity.service';
import { FeedbackActivitySummary, FeedbackWithActivity } from './dto/feedback.interface';



@Injectable()
export class FeedbackService {
constructor(private readonly prisma:PrismaService, private readonly activity: ActivityService){}

  async create(body: CreateFeedbackDto, userId:string) : Promise<Feedback> {
    const { planningId, ...feedbackData } = body
    return await this.prisma.feedback.create({
      data: {
        ...feedbackData,
        user:{connect: { id: userId}},
        planning:{ connect: {id: planningId}}
    }
    });
  }

  async findAll() : Promise<FeedbackActivitySummary[]>{
     const feedbacks = await this.prisma.feedback.findMany({
      where: {
        status: Favorite.IsFavorite,
      },
      include: {
        planning: {
          include: {
            activity: true,
          },
        },
      },
    });

    // 2. On groupe en JS par activityId
    const map = new Map<string, FeedbackActivitySummary>();

    for (const fb of feedbacks) {
      const activity = fb.planning?.activity;
      if (!activity) continue; 

      const key = activity.id;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          activityId: activity.id,
          activityName: activity.name,
          likes: 1,
        });
      } else {
        existing.likes += 1;
      }
    }

    return Array.from(map.values());
  }
  //   const feedbacks =  await this.prisma.feedback.findMany({
  //     include: {
  //       planning: {
  //         include: {
  //           activity: true
  //         },
  //       },
  //     },
  //   });
  //    return feedbacks.map((fb) => ({
  //     status: fb.status,
  //     userId: fb.userId,
  //     planningId: fb.planningId,
  //     createdAt: fb.createdAt,
  //     updatedAt: fb.updatedAt,
  //     activityId: fb.planning.activityId,
  //     activityName: fb.planning.activity?.name ?? null,
  //   }));
  // }


  async findOne(planningId:string, userId: string): Promise<Feedback | null>  {
    return await this.prisma.feedback.findUnique({ where: { planningId_userId: { planningId,userId} } });
  }

  async update(
    planningId:string, userId: string,
    body: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return await this.prisma.feedback.update({
      where: { planningId_userId: { planningId,userId}},
      data: {
        ...body
      },
    });
  }

  async remove(planningId:string, userId: string): Promise<Feedback> {
      return await this.prisma.feedback.delete({where: { planningId_userId: { planningId,userId}}});
    }
}
