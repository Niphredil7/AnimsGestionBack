import { Injectable } from '@nestjs/common';
import { CreateHappenningDto } from './dto/create-happenning.dto';
import { UpdateHappenningDto } from './dto/update-happenning.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Happenning } from '@prisma/client';

@Injectable()
export class HappenningService {
  constructor(private readonly prisma:PrismaService){}

async create(body: CreateHappenningDto): Promise<Happenning> {
  const {creatorId, ...happenningData} = body
    return await this.prisma.happenning.create({
      data: {
        ...happenningData,
        creator: {connect: { id: creatorId}}
    }
    });
  }

  async findAll(): Promise<Happenning[]> {
    return await this.prisma.happenning.findMany();
  }

  async findOne(id: string): Promise<Happenning | null> {
    return await this.prisma.happenning.findUnique({ where: { id } });
  }

    async findByTitle(title: string): Promise<Happenning[] | null> {
      return await this.prisma.happenning.findMany({
        where: { title },
      });
    }

  async update(
    id: string,
    body: UpdateHappenningDto,
  ): Promise<Happenning> {
    return await this.prisma.happenning.update({
      where: { id },
      data: {
        ...body
      },
    });
  }
  async remove(id: string): Promise<Happenning> {
    return await this.prisma.happenning.delete({
      where: { id },
    });
  }
}
