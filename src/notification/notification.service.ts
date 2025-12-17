import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Notification, NotificationType } from '@prisma/client';
import { UserNotificationData } from './dto/notification.interface';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
constructor(private readonly prisma:PrismaService, private readonly gateway: NotificationsGateway){}

 async createActivityNotification(
    userIds: string[],
    planningActivityId: string,
    message: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        type: NotificationType.ACTIVITY,
        message,
        planningActivityId,
        users: {
          createMany: {
            data: userIds.map((userId) => ({
              userId,
              seen: false,
            })),
          },
        },
      },
      include: {
        planningActivity: true,
        users: true, // UserHasNotification
      },
    });

    const planning = notification.planningActivity;

    const basePayload = {
      id: notification.id,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      data: planning && {
        kind: 'ACTIVITY' as const,
        validatedAt: planning.validatedAt
          ? planning.validatedAt.toISOString()
          : null,
        moment: planning.moment,
        classId: planning.classId,
        planningId: planning.planningId,
        activityId: planning.activityId,
        outingId: planning.outingId,
      },
    };

    // pour chaque user,  notif avec son "seen"
    for (const userNotif of notification.users) {
      const payload: UserNotificationData = {
        ...(basePayload as any),
        seen: userNotif.seen,
      };

      this.gateway.sendNotificationToUser(userNotif.userId, payload);
    }

    return notification;
  }

  // Idem pour HAPPENNING 
  async createHappenningNotification(
    userIds: string[],
    happenningId: string,
    message: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        type: NotificationType.HAPPENNING,
        message,
        happenningId,
        users: {
          createMany: {
            data: userIds.map((userId) => ({
              userId,
              seen: false,
            })),
          },
        },
      },
      include: {
        happenning: true,
        users: true,
      },
    });

    const h = notification.happenning;

    const basePayload = {
      id: notification.id,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      data: h && {
        kind: 'HAPPENNING' as const,
        title: h.title,
        content: h.content,
        dateStart: h.dateStart.toISOString(),
        dateEnd: h.dateEnd.toISOString(),
      },
    };

    for (const userNotif of notification.users) {
      const payload: UserNotificationData = {
        ...(basePayload as any),
        seen: userNotif.seen,
      };

      this.gateway.sendNotificationToUser(userNotif.userId, payload);
    }

    return notification;
  }


    async findAll(): Promise<Notification[]> {
      return await this.prisma.notification.findMany();
    }

  async findOne(id: string): Promise<Notification | null> {
      return await this.prisma.notification.findUnique({ where: { id } });
    }
async getNotifByUser(userId:string): Promise<UserNotificationData[]>{

const rows = await this.prisma.userHasNotification.findMany({
    where: { userId },
    include: {
      notification: {
        include: {
          happenning: true,
          planningActivity: true,
        },
      },
    },
    orderBy: {
      notification: {
        createdAt: "desc",
      },
    },
  });

  return rows.map<UserNotificationData>((row) => {
    const n = row.notification;

    let data: UserNotificationData["data"] = null;

    // HAPPENNING
    if (n.type === NotificationType.HAPPENNING && n.happenning) {
      data = {
        kind: "HAPPENNING",
        id: n.happenning.id,
        title: n.happenning.title,
        content: n.happenning.content,
        dateStart: n.happenning.dateStart,
        dateEnd: n.happenning.dateEnd,
      };
    }

    //  ACTIVITY : on passe par planningActivity pour récupérer moment / validatedAt / ids
    if (n.type === NotificationType.ACTIVITY && n.planningActivity) {
      const pa = n.planningActivity;

      data = {
        kind: "ACTIVITY",
        id: pa.id,
        moment: pa.moment,  
        validatedAt: pa.validatedAt, 
        activityId: pa.activityId ?? undefined,
        outingId: pa.outingId ?? undefined,
        planningId: pa.planningId,
        classId: pa.classId,
      };
    }

    return {
      id: n.id,
      type: n.type,
      message: n.message,
      createdAt: n.createdAt,
      seen: row.seen,
      data,
    };
  });
}

async markAllAsSeen(userId: string) {
  await this.prisma.userHasNotification.updateMany({
    where: { userId },
    data: { seen: true },
  });

  return { success: true };
}

   async update(
      id: string,
      body: UpdateNotificationDto,
    ): Promise<Notification> {
      return await this.prisma.notification.update({
        where: { id },
        data: {

        },
      });
    }

  async remove(id: string): Promise<Notification> {
      return await this.prisma.notification.delete({
        where: { id },
      });
    }
}
