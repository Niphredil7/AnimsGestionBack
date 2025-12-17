import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from 'src/auth/guard/access-token.guard';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { Activity } from '@prisma/client';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { CustomHttpException } from 'src/utils/custom.exception';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('activity')
@UseGuards(AuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
      async create(
        @Body() body: CreateActivityDto, @Req() req: IRequestWithPayload
       ): Promise<ResponseInterfaceWithData<{ newActivity: Activity}>> 
       {
        return {
          data:  {newActivity: await this.activityService.create(body)},
          message: `Nouvel activity créé`,
        };
      }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ activities: Activity[]}>> {
      return { data: {activities: await this.activityService.findAll()}, message: 'Liste des activity' };
    }


   @Get(':userId')
  async findByUser(@Req() req: IRequestWithPayload): Promise<ResponseInterfaceWithData<{ activities: Activity[]}>> {
      return { data: {activities: await this.activityService.findByUser(req.user.id)}, message: 'Liste des activity d cet user' };
    } 

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: Activity; message: string }> {
    const activity = await this.activityService.findOne(id);
    if (!activity)
      throw new CustomHttpException(`Student ${activity} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
    return { data: activity, message: 'Activitée :' };
  }
  @Patch(':id')
 async update(
    @Param('id') id: string,
    @Body() body: UpdateActivityDto,
  ): Promise<{ data: Activity; message: string }> {
    const activity = await this.findOne(id);
    if (!activity) {
      throw new NotFoundException(`Activity ${id} not exist`);
    }
    const newActivity = await this.activityService.update(id, body);
    return { data: newActivity, message: 'Activity mis à jour' };
  }

  @Delete(':id')
 async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.activityService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "L'activité a été delete." };
  }
}
