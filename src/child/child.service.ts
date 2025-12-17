import { Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ActivityForbidenn, Child, Class, Regime } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChildService {
constructor(private readonly prisma:PrismaService) {}

 async create(body: CreateChildDto, regime: Regime = Regime.NONE, activityForbiden: ActivityForbidenn = ActivityForbidenn.NONE): Promise<Child> {
   const { schoolId, classId, ...childData } = body;
    return this.prisma.child.create({
    data: {
      ...childData, 
      regime,
      activityForbiden,
      school: {
        connect: { id: schoolId }, 
      },
      class: {
        connect: { id: classId },
      },
    },
  });
}

 async findAll(): Promise<Child[]> {
    return await this.prisma.child.findMany();
  }

  async findOne(id: string): Promise<Child | null> {
    return await this.prisma.child.findUnique({ where: { id } });
  }

  async findByName(lastName: string): Promise<Child[] | null> {
      return await this.prisma.child.findMany({
        where: { lastName },
      });
    }

    async findByClassId(classId: string): Promise<Child[] | null> {
    return this.prisma.child.findMany({
    where: { classId },
  });
  };

  async findClass(id: string): Promise<Child | null> {
    return this.prisma.child.findUnique({
    where: { id },
    include:{class:true},
  });
  };


async countByGender(): Promise<number[]> {
  const girls = await this.prisma.child.count({ where: { sexe: 'F' } });
  const boys = await this.prisma.child.count({ where: { sexe: 'M' } });
  return [girls, boys];
}

async countByGenderByClass(classId: string): Promise<number[]> {

    const girls = await this.prisma.child.count({ where: { classId, sexe: 'F' } });

  const boys = await this.prisma.child.count({ where: { classId, sexe: 'M' } });

  return [girls, boys]
}

  async findByParentId(parentId: string): Promise<Child[] | null> {
  return await this.prisma.child.findMany({
    where: { parentId },
    include: { class: true },
  });
}


   async update(
      id: string,
      body: UpdateChildDto,
    ): Promise<Child> {
      return await this.prisma.child.update({
        where: { id },
        data: {
          ...body
        },
      });
    }

  async remove(id: string): Promise<Child> {
    return await this.prisma.child.delete({
      where: { id },
    });
  }
}
