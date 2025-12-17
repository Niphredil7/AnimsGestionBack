import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Planning, Prisma } from '@prisma/client';
import { ClasseService } from 'src/classe/classe.service';
import { getMondayBeforeDate } from 'src/utils/function';


type PlanningWithActivities = Prisma.PlanningGetPayload<{
  include: {
    planningActivities: {
      include: {
        activity: true;
        outing: true;
      };
    };
  };
}>;

@Injectable()
export class PlanningService {
  constructor(private readonly prisma: PrismaService, private readonly classe: ClasseService) {}

  async create(body: CreatePlanningDto): Promise<Planning> {

    // cliquée envoyée par le front
    const clickedDate = new Date(body.dateStart);

    //  lundi de la semaine
    const monday = getMondayBeforeDate(clickedDate);

    //  si un planning existe pour ce lundi
    const existing = await this.prisma.planning.findFirst({
      where: {
        dateStart: monday,
      },
    });

    if (existing) {
      return existing;
    }

    // créer le planning
    return this.prisma.planning.create({
      data: {
        dateStart: monday,
      },
    });
  }



  async findNextByClass(
    classId: string,
    fromDate: Date,
    count = 4,
  ): Promise<PlanningWithActivities[]> {
    return this.prisma.planning.findMany({
      where: {
        dateStart: { gt: fromDate },
        planningActivities: {
          some: { classId },
        },
      },
      orderBy: { dateStart: 'asc' },
      take: count,
      include: {
        planningActivities: {
          include: {
            activity: true,
            outing: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Planning[]> {
    return await this.prisma.planning.findMany({
      orderBy: { dateStart: 'asc' },
    });
  }

  async findOne(id: string): Promise<Planning | null> {
    return await this.prisma.planning.findUnique({ where: { id } });
  }

  async findByDateStart(dateStart: Date): Promise<Planning[]> {
    return this.prisma.planning.findMany({
      where: { dateStart },
    });
  }

  async update(id: string, body: UpdatePlanningDto): Promise<Planning> {
    return await this.prisma.planning.update({
      where: { id },
      data: {
        ...body,
      },
    });
  }

  async remove(id: string): Promise<Planning> {
    return await this.prisma.planning.delete({
      where: { id },
    });
  }
}
