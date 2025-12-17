import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { UserHasNotificationService } from './user-has-notification.service';
import { CreateUserHasNotificationDto } from './dto/create-user-has-notification.dto';
import { UpdateUserHasNotificationDto } from './dto/update-user-has-notification.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { UserHasNotification } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('user-has-notification')

export class UserHasNotificationController {
  constructor(private readonly userHasNotificationService: UserHasNotificationService) {}

  @Post()
  async create(@Body() body: CreateUserHasNotificationDto, @Req() req: IRequestWithPayload
): Promise<ResponseInterfaceWithData<{ newUserNotif: UserHasNotification}>> {
   const userNotifExist = await this.userHasNotificationService.findOne(body.notificationId, req.user.id);
          if (userNotifExist)
            throw new BadRequestException('Ce feedback est déjà enregistré');
    return {
          data:  {newUserNotif: await this.userHasNotificationService.create(body)},
          message: `Nouvel feedback créé`,
        };
      }

  @Get()
  async findAll() {
    return this.userHasNotificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') notificationId: string, @Req() req: IRequestWithPayload
): Promise<{ data: UserHasNotification; message: string }>  {
    const userNotif = await this.userHasNotificationService.findOne(notificationId, req.user.id);
  if (!userNotif) throw new CustomHttpException(`UserNotif ${userNotif} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
   return { data: userNotif, message: 'userNotif :' };
  }

  @Patch(':id')
  async update(
    @Param('id') notificationId: string, 
    @Body() body: UpdateUserHasNotificationDto,
  @Req() req: IRequestWithPayload
) : Promise<{ data: UserHasNotification; message: string }>{
  const userNotification = await this.userHasNotificationService.findOne(notificationId, req.user.id);
        if (!userNotification) {
          throw new NotFoundException(`Notification ${notificationId}, ${req.user.id} not exist`);
        }
    const notifUpdate = await this.userHasNotificationService.update(notificationId,req.user.id, body);
    return { data: notifUpdate, message: 'Notif mise à jour' }
  }

  @Delete(':id')
  async remove(
    @Param('id') notificationId: string,
    @Req() req: IRequestWithPayload
  ): Promise<{ message: string }> {
    try {
      await this.userHasNotificationService.remove(notificationId, req.user.id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "La notif a été delete." };
  }
}
