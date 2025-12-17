import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { PlanningActivityService } from './planning-activity.service';
import { CreatePlanningActivityDto } from './dto/create-planning-activity.dto';
import { UpdatePlanningActivityDto } from './dto/update-planning-activity.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { PlanningActivity } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';

@Controller('planning-activity')
export class PlanningActivityController {
  constructor(private readonly planningActivityService: PlanningActivityService) {}

  @Post()
  async create(
           @Body() body: CreatePlanningActivityDto, @Req() req: IRequestWithPayload
          ): Promise<ResponseInterfaceWithData<{ newPlanActivity: PlanningActivity}>> 
          {
            return {
              data:  {newPlanActivity: await this.planningActivityService.create(body)},
              message: `Nouvel activity créé`,
            };
          }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ planActivities: PlanningActivity[]}>> {
          return { data: {planActivities: await this.planningActivityService.findAll()}, message: 'Liste des activités' };
        }

         @Get(":classId")
  async findByUser(@Param('classId') classId: string,): Promise<ResponseInterfaceWithData<{ planActivities: PlanningActivity[]}>> {
          return { data: {planActivities: await this.planningActivityService.getPlanningActivitiesByUser(classId)}, message: 'Liste des activités' };
        }

        @Get('class/:classId')
async getByClassAndWeek(
  @Param('classId') classId: string,
  @Query('dateStart') dateStart: string,
): Promise<ResponseInterfaceWithData<{ planActivities: PlanningActivity[] }>> {

  const date = new Date(dateStart);

  const planActivities = await this.planningActivityService.getByClassAndWeek(
    classId,
    date,
  );

  return {
    data: { planActivities },
    message: 'Planning activités pour cette classe et cette semaine',
  };
}

  @Get(':id')
  async findOne(
       @Param('id') id: string,
     ): Promise<{ data: PlanningActivity; message: string }> {
       const planActivity = await this.planningActivityService.findOne(id);
       if (!planActivity)
         throw new CustomHttpException(`Activité ${planActivity.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
       return { data: planActivity, message: "Planning d'Activité :" };
     }

  @Patch(':id')
  async update(
        @Param('id') id: string,
        @Body() body: UpdatePlanningActivityDto,
      ): Promise<{ data: PlanningActivity; message: string }> {
        const planActivity = await this.findOne(id);
        if (!planActivity) {
          throw new NotFoundException(`Activity ${id} not exist`);
        }
        const newPlanActivity = await this.planningActivityService.update(id, body);
        return { data: newPlanActivity, message: 'Activité mis à jour' };
      }

      @Patch(':id/validate')
  async validate(@Param('id') id: string) {
    const planActivity = await this.findOne(id);
        if (!planActivity) {
          throw new NotFoundException(`Activity ${id} not exist`);
        }
    const validatedActivity = this.planningActivityService.validateActivity(id);
        return { data: validatedActivity, message: 'Activité validée'}
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.planningActivityService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le planning d'activité a été delete." };
  }
}
