import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { OutingService } from './outing.service';
import { CreateOutingDto } from './dto/create-outing.dto';
import { UpdateOutingDto } from './dto/update-outing.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { Outing } from '@prisma/client';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { CustomHttpException } from 'src/utils/custom.exception';

@Controller('outing')
export class OutingController {
  constructor(private readonly outingService: OutingService) {}

  @Post()
  async create(
          @Body() body: CreateOutingDto, @Req() req: IRequestWithPayload
        ): Promise<ResponseInterfaceWithData<{ newActivity: Outing}>> {
          const outing = await this.outingService.findByName(body.name);
          if (outing)
            throw new BadRequestException('Cet sorie est déjà proposée');
          return {
            data:  {newActivity: await this.outingService.create(body)},
            message: `Nouvel activity créé`,
          };
        }

  @Get()
   async findAll(): Promise<ResponseInterfaceWithData<{ outings: Outing[]}>> {
        return { data: {outings: await this.outingService.findAll()}, message: 'Liste des sorties' };
      }

  @Get(':id')
 async findOne(
     @Param('id') id: string,
   ): Promise<{ data: Outing; message: string }> {
     const outing = await this.outingService.findOne(id);
     if (!outing)
       throw new CustomHttpException(`Sortie ${outing.name} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
     return { data: outing, message: 'Sorties :' };
   }

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdateOutingDto,
    ): Promise<{ data: Outing; message: string }> {
      const outing = await this.findOne(id);
      if (!outing) {
        throw new NotFoundException(`Activity ${id} not exist`);
      }
      const newOuting = await this.outingService.update(id, body);
      return { data: newOuting, message: 'Sortie mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.outingService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "La sortie a été delete." };
  }
}
