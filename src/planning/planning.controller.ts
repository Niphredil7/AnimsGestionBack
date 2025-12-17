import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { Planning } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';


@Controller('planning')

export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  async create(
        @Body() body: CreatePlanningDto, @Req() req: IRequestWithPayload
       ): Promise<ResponseInterfaceWithData<{ newPlanning: Planning}>> 
       {
        return {
          data:  {newPlanning: await this.planningService.create(body)},
          message: `Nouvel planning créé`,
        };
      }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ newPlanning: Planning[]}>> {
      return { data: {newPlanning: await this.planningService.findAll()}, message: 'Liste des planning' };
    }

  @Get('classe/:classId/next')
  async getNextPlannings(
  @Param('classId') classId: string,
  @Query('from') from: string,   // ex: "2025-11-24"
  @Query('count') count = '4',
) {
  const fromDate = from ? new Date(from) : new Date();
  const nb = Number(count) || 4;

  const data = await this.planningService.findNextByClass(classId, fromDate, nb);

  return {
    data,
    message: 'Prochains plannings',
  };
}

  @Get(':id')
  async findOne(
      @Param('id') id: string,
    ): Promise<{ data: Planning; message: string }> {
      const planning = await this.planningService.findOne(id);
      if (!planning)
        throw new CustomHttpException(`Planning ${planning.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: planning, message: 'Plannings :' };
    }
  

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdatePlanningDto,
    ): Promise<{ data: Planning; message: string }> {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException(`Planning ${id} not exist`);
      }
      const newPlanning = await this.planningService.update(id, body);
      return { data: newPlanning, message: 'Planning mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.planningService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le planning a été delete." };
  }
}
