import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { Notification, UserStatus } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';
import { CreateActivityNotificationDto, CreateHappenningNotificationDto, UserNotificationData } from './dto/notification.interface';

@Controller('notification')

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("activity")
  async createActivityNotification(
        @Body() body: CreateActivityNotificationDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newNotification: Notification}>> {
        const { userIds, planningActivityId, message } = body;
        return {
          data:  {newNotification: await this.notificationService.createActivityNotification(
              userIds,
              planningActivityId,
              message
          )},
          message: `Nouvel notif créé`,
        };
      }

      @Post("happenning")
  async createHappenningNotification(
        @Body() body: CreateHappenningNotificationDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newNotification: Notification}>> {
        const { userIds, happenningId, message } = body;
        return {
          data:  {newNotification: await this.notificationService.createHappenningNotification(
              userIds,
              happenningId,
              message
          )},
          message: `Nouvel notif créé`,
        };
      }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ users: Notification[]}>> {
      return { data: {users: await this.notificationService.findAll()}, message: 'Liste des notifs' };
    }

    @Get("me")
  async getMyNotification(
    @Req() req: IRequestWithPayload,
  ): Promise<UserNotificationData[]> {

    const userId = req.user.id
    return this.notificationService.getNotifByUser(userId);
  }

  @Get(':id')
  async findOne(
      @Param('id') id: string,
    ): Promise<{ data: Notification; message: string }> {
      const notif = await this.notificationService.findOne(id);
      if (!notif)
        throw new CustomHttpException(`Notif ${notif.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: notif, message: 'Notificaions :' };
    }

     @Patch('seen-all')
  async markAllAsSeen(@Req() req: IRequestWithPayload) {
    const userId = req.user.id
    return this.notificationService.markAllAsSeen(userId);
  }

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdateNotificationDto,
    ): Promise<{ data: Notification; message: string }> {
      const notif = await this.findOne(id);
      if (!notif) {
        throw new NotFoundException(`Notification ${id} not exist`);
      }
      const newNotification = await this.notificationService.update(id, body);
      return { data: newNotification, message: 'Notification mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.notificationService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "La notif a été delete." };
  }
}
