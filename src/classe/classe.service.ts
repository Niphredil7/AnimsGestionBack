import { Injectable } from '@nestjs/common';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Class } from '@prisma/client';


@Injectable()
export class ClasseService {
 constructor(private readonly prisma:PrismaService){}

  async create(body: CreateClasseDto) : Promise<Class> {
    return await this.prisma.class.create({
      data: {
        ...body
    }
    });
  }

  async findAll(): Promise<Class[]> {
    return await this.prisma.class.findMany();
  }

 async findOne(id: string): Promise<Class | null>  {
    return await this.prisma.class.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Class[] | null> {
      return await this.prisma.class.findMany({
        where: { name },
      });
    }

     async findByUser(userId: string): Promise<Class | null> {

      return await this.prisma.class.findFirst({
        where: { userId },
      });
    }

  async update(
    id: string,
    body: UpdateClasseDto,
  ): Promise<Class> {
    return await this.prisma.class.update({
      where: { id },
      data: {
        ...body
      },
    });
  }

 async remove(id: string): Promise<Class> {
    return await this.prisma.class.delete({
      where: { id },
    });
  }
}
