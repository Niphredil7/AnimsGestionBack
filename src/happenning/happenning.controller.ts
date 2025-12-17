import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { HappenningService } from './happenning.service';
import { CreateHappenningDto } from './dto/create-happenning.dto';
import { UpdateHappenningDto } from './dto/update-happenning.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { Happenning } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('happenning')

export class HappenningController {
    constructor(private readonly happenningService: HappenningService) {}
  
    @Post()
    async create(
      @Body() body: CreateHappenningDto, @Req() req: IRequestWithPayload
    ): Promise<ResponseInterfaceWithData<{ newHappenning: Happenning}>> {
      if(!req.user.id) throw new BadRequestException("vous n'avez pas accès à ce service")
      return {
        data:  {newHappenning: await this.happenningService.create(body)},
        message: `Nouvel event créé`,
      };
    }


  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ users: Happenning[]}>> {
    return { data: {users: await this.happenningService.findAll()}, message: 'Liste des events' };
  }


  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: Happenning; message: string }> {
    const event = await this.happenningService.findOne(id);
    if (!event)
      throw new CustomHttpException(`Event ${event} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
    return { data: event, message: 'Events :' };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateHappenningDto,
  ): Promise<{ data: Happenning; message: string }> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Event ${id} not exist`);
    }
    const newUser = await this.happenningService.update(id, body);
    return { data: newUser, message: 'Event mis à jour' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.happenningService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le event a été delete." };
  }
}
