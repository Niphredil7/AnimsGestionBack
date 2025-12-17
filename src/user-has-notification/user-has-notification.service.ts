import { Injectable } from '@nestjs/common';
import { CreateUserHasNotificationDto } from './dto/create-user-has-notification.dto';
import { UpdateUserHasNotificationDto } from './dto/update-user-has-notification.dto';
import { UserHasNotification } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserHasNotificationService {
constructor(private readonly prisma:PrismaService){}

  async create(body: CreateUserHasNotificationDto): Promise<UserHasNotification> {
const { notificationId, userId, ...userNotif} = body
    return await this.prisma.userHasNotification.create({
      data: {
        ...userNotif,
        userSent:{connect: { id: userId}},
        notification:{ connect: {id: notificationId}}
    }})}

  async findAll(): Promise<UserHasNotification[]> {
     return await this.prisma.userHasNotification.findMany();
  }

  async findOne(notificationId: string, userId:string): Promise<UserHasNotification | null> {
    return await this.prisma.userHasNotification.findUnique({ where: { notificationId_userId: { notificationId,userId} } });
  }

  async update( notificationId:string, userId: string, 
    body: UpdateUserHasNotificationDto
  ): Promise<UserHasNotification>  {
     return await this.prisma.userHasNotification.update({
      where: { notificationId_userId: { notificationId,userId}},
      data: {
        ...body
      },
    });
  }

   async remove(notificationId:string, userId: string): Promise<UserHasNotification> {
        return await this.prisma.userHasNotification.delete({where: { notificationId_userId: { notificationId,userId}}});
      }
}
