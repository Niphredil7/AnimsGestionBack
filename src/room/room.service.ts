import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Room } from '@prisma/client';

@Injectable()
export class RoomService {
constructor(private readonly prisma:PrismaService){}

  async create(body: CreateRoomDto) {
    return await this.prisma.room.create({
      data: {
        ...body,
    }
    });
  }

  async findAll(): Promise<Room[]> {
      return await this.prisma.room.findMany();
    }

  async findOne(id: string): Promise<Room | null> {
      return await this.prisma.room.findUnique({ where: { id } });
    }

    async findByName(name: string): Promise<Room | null> {
        return await this.prisma.room.findFirst({
          where: { name },
        });
      }

  async update(
      id: string,
      body: UpdateRoomDto,
    ): Promise<Room> {
      return await this.prisma.room.update({
        where: { id },
        data: {
          ...body
        },
      });
    }

  async remove(id: string): Promise<Room> {
      return await this.prisma.room.delete({
        where: { id },
      });
    }
}
