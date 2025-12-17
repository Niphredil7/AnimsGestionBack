import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School, SchoolType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SchoolService {
 constructor(private readonly prisma:PrismaService){}

async create(body: CreateSchoolDto): Promise<School> {
    return await this.prisma.school.create({
      data: {
        ...body,
    }
    });
    
  }

  async findAll(): Promise<School[]> {
    return await this.prisma.school.findMany();
  }

  async findOne(id: string): Promise<School | null> {
    return await this.prisma.school.findUnique({ where: { id } });
  }

    async findByAddress(address: string): Promise<School | null> {
      return await this.prisma.school.findUnique({
        where: { address },
      });
    }

  async update(
    id: string,
    body: UpdateSchoolDto,
  ): Promise<School> {
    return await this.prisma.school.update({
      where: { id },
      data: {
        ...body
      },
    });
  }

  async remove(id: string): Promise<School> {
    return await this.prisma.school.delete({
      where: { id },
    });
  }
}
