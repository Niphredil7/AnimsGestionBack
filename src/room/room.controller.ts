import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { Room } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('room')

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(
        @Body() body: CreateRoomDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newRoom: Room}>> {
        const room = await this.roomService.findByName(body.name);
        if (room)
          throw new BadRequestException('Cet salle est déjà enregistré');
        return {
          data:  {newRoom: await this.roomService.create(body)},
          message: `Nouvel sllae créé`,
        };
      }

  @Get()
  async findAll(): Promise<Room[]> {
      return await this.roomService.findAll();
    }

  @Get(':id')
  async findOne(
      @Param('id') id: string,
    ): Promise<{ data: Room; message: string }> {
      const room = await this.roomService.findOne(id);
      if (!room)
        throw new CustomHttpException(`Salle ${room.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: room, message: 'Salles :' };
    }

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdateRoomDto,
    ): Promise<{ data: Room; message: string }> {
      const room = await this.findOne(id);
      if (!room) {
        throw new NotFoundException(`Salles ${id} not exist`);
      }
      const newRoom = await this.roomService.update(id, body);
      return { data: newRoom, message: 'User mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.roomService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le salle a été delete." };
  }
}
