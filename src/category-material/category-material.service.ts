import { Injectable } from '@nestjs/common';
import { CreateCategoryMaterialDto } from './dto/create-category-material.dto';
import { UpdateCategoryMaterialDto } from './dto/update-category-material.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryMaterial } from '@prisma/client';

@Injectable()
export class CategoryMaterialService {
constructor(private readonly prisma:PrismaService){}

  async create(body: CreateCategoryMaterialDto) : Promise<CategoryMaterial> {
    const {
    existingMaterialIds = [],
    newMaterials = [],
    ...categoryData
  } = body;
    return await this.prisma.categoryMaterial.create({
      
      data: {

        ...categoryData,
        materials:{connect: existingMaterialIds.map((id) => ({ id })), 
       create: newMaterials.map((m) => ({
          name: m.name,
        })),
        }
    }});
  }

  async findAll(): Promise<CategoryMaterial[]> {
      return await this.prisma.categoryMaterial.findMany();
    }

  async findOne(id: string): Promise<CategoryMaterial | null>  {
    return await this.prisma.categoryMaterial.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<CategoryMaterial | null> {
      return await this.prisma.categoryMaterial.findFirst({
        where: { name },
      });
    }

  async update(
    id: string,
    body: UpdateCategoryMaterialDto,
  ): Promise<CategoryMaterial> {
    return await this.prisma.categoryMaterial.update({
      where: { id },
      data: {
        ...body
      },
    });
  }

 async remove(id: string): Promise<CategoryMaterial> {
     return await this.prisma.categoryMaterial.delete({
       where: { id },
     });
   }
}
