import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, HttpStatus, NotFoundException, Req } from '@nestjs/common';
import { CategoryMaterialService } from './category-material.service';
import { CreateCategoryMaterialDto } from './dto/create-category-material.dto';
import { UpdateCategoryMaterialDto } from './dto/update-category-material.dto';
import { AuthGuard } from 'src/auth/guard/access-token.guard';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { CategoryMaterial } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';

@Controller('category-material')

export class CategoryMaterialController {
  constructor(private readonly categoryMaterialService: CategoryMaterialService) {}

  @Post()
  async create(
        @Body() body: CreateCategoryMaterialDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newCategory: CategoryMaterial}>> {
        const category = await this.categoryMaterialService.findByName(body.name);
        if (category)
          throw new BadRequestException('Cet catégorie est déjà enregistré');
        return {
          data:  {newCategory: await this.categoryMaterialService.create(body)},
          message: `Nouvelle catégorie créé`,
        };
      }

  @Get()
  async findAll(@Req() req: IRequestWithPayload): Promise<ResponseInterfaceWithData<CategoryMaterial[]>> {
      return { data: await this.categoryMaterialService.findAll()};
    }

  @Get(':id')
  async findOne(
      @Param('id') id: string,
      @Req() req: IRequestWithPayload
    ): Promise<{ data: CategoryMaterial; message: string }> {
      const category = await this.categoryMaterialService.findOne(id);
      if (!category)
        throw new CustomHttpException(`Student ${category.name} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: category, message: 'Catégories :' };
    }

  @Patch(':id')
   async update(
     @Param('id') id: string,
     @Body() body: UpdateCategoryMaterialDto,
     @Req() req: IRequestWithPayload
   ): Promise<{ data: CategoryMaterial; message: string }> {
     const category = await this.categoryMaterialService.findOne(id);
     if (!category) {
       throw new NotFoundException(`User ${id} not exist`);
     }
     const newCategory = await this.categoryMaterialService.update(id, body);
     return { data: newCategory, message: 'Catégorie mis à jour' };
   }

  @Delete(':id')
   async remove(@Param('id') id: string, @Req() req: IRequestWithPayload): Promise<{ message: string }> {
    try {
      await this.categoryMaterialService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le catégorie a été delete." };
  }
}
