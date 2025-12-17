import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanningActivityDto } from './dto/create-planning-activity.dto';
import { UpdatePlanningActivityDto } from './dto/update-planning-activity.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PlanningActivity, Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';


@Injectable()
export class PlanningActivityService {
constructor(private readonly prisma:PrismaService, private readonly notificationService: NotificationService){}

 async create(body: CreatePlanningActivityDto): Promise<PlanningActivity> {
    const { activityId, outingId, planningId, classId, day, moment, validatedAt } = body;


    if (!planningId) {
      throw new BadRequestException("planningId est obligatoire pour créer un PlanningActivity");
    }

    //  activité, règle des 2 salles max
    if (activityId) {
      // récup la salle de l'activité
      const activity = await this.prisma.activity.findUnique({
        where: { id: activityId },
        select: { roomId: true },
      });

      if (!activity) {
        throw new BadRequestException("Activité introuvable");
      }

      const roomId = activity.roomId;

      if (!roomId) {
        throw new BadRequestException("L'activité n'a pas de salle associée");
      }

      // compter combien de PlanningActivity sont déjà sur ce créneau pour cette salle
      const existingCount = await this.prisma.planningActivity.count({
        where: {
          planningId,
          day,
          moment,
          activity: {
            roomId,
          },
        },
      });

      if (existingCount >= 2) {
        throw new BadRequestException(
          "Cette salle est déjà utilisée pour deux activités sur ce créneau (même jour et moment).",
        );
      }
    }

    // Si c'est une sortie , on accepte juste le planningId + day + moment + classId + outingId

    //PlanningActivity
    return this.prisma.planningActivity.create({
      data: {
        planningId,
        classId,
        day,
        moment,
        validatedAt,
        activityId: activityId ?? undefined,
        outingId: outingId ?? undefined,
      },
    });
  }




  async findAll(): Promise<PlanningActivity[]> {
    return await this.prisma.planningActivity.findMany();
  }

  async findOne(id: string): Promise<PlanningActivity | null> {
    return await this.prisma.planningActivity.findUnique({ where: { id }});
  }

  async getPlanningActivitiesByUser(classId:string):Promise<PlanningActivity[]> {
    return await this.prisma.planningActivity.findMany({ where: { classId }});
  }

  async getByClassAndWeek(classId: string, dateStart: Date): Promise<PlanningActivity[]> {
  // planning correspondant à ce lundi
  const planning = await this.prisma.planning.findFirst({
    where: { dateStart },
  });

  if (!planning) return [];
  

  //PlanningActivity de cette classe pour ce planning
  return this.prisma.planningActivity.findMany({
    where: {
      classId,
      planningId: planning.id,
    },
   include: {
      activity: {
        include: {
          room: true,
        },
      },
      outing: true,
    },
  });
}

  async update(
         id: string,
         body: UpdatePlanningActivityDto,
       ): Promise<PlanningActivity> {
         return await this.prisma.planningActivity.update({
           where: { id },
           data: {
             ...body
           },
         });
       }

       async validateActivity(planningActivityId: string) {
    // validatedAt
    const planningActivity = await this.prisma.planningActivity.update({
      where: { id: planningActivityId },
      data: { validatedAt: new Date() },
      include: {
        activity: { select: { userId: true, name: true } },
        outing: { select: { userId: true, name: true } },
        classe: { select: { id: true, name: true } },
        planning: { select: { id: true } },
      },
    });

    //  quel user doit être notifié
    //   le créateur de l'activité ou de la sortie
    const creatorId =
      planningActivity.activity?.userId ?? planningActivity.outing?.userId;

    if (!creatorId) {
      // si pas de créateur 
      throw new NotFoundException("Pas de user pour cette activité")
    }

    //  message
    const label =
      planningActivity.activity?.name ??
      planningActivity.outing?.name ??
      "activité";

    const message = `Votre ${label} a été validée.`;

    // 4. Créer la notification + envoyer via WebSocket
    await this.notificationService.createActivityNotification(
      [creatorId],                 
      planningActivity.id,    
      message,
    );

    return planningActivity;
  }

  async remove(id: string): Promise<PlanningActivity> {
          return await this.prisma.planningActivity.delete({
            where: { id },
          });
        }
}
