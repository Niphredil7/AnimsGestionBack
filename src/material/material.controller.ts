import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { Material } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';

@Controller('material')

export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(
        @Body() body: CreateMaterialDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newMaterial: Material}>> {
        const material = await this.materialService.findByName(body.name);
        if (material)
          throw new BadRequestException('Ce material est déjà enregistré');
        return {
          data:  {newMaterial: await this.materialService.create(body)},
          message: `Nouveau matos créé`,
        };
      }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ materials: Material[]}>> {
      return { data: {materials: await this.materialService.findAll()}, message: 'Liste des materials' };
    }

  @Get(':id')
  async findOne(
      @Param('id') id: string,
    ): Promise<{ data: Material; message: string }> {
      const material = await this.materialService.findOne(id);
      if (!material)
        throw new CustomHttpException(`Material ${material.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: material, message: 'Matériaux :' };
    }

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdateMaterialDto,
    ): Promise<{ data: Material; message: string }> {
      const material = await this.findOne(id);
      if (!material) {
        throw new NotFoundException(`Material ${id} not exist`);
      }
      const newMaterial = await this.materialService.update(id, body);
      return { data: newMaterial, message: 'Material mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.materialService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le material a été delete." };
  }
}
