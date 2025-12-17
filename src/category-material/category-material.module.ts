import { Module } from '@nestjs/common';
import { CategoryMaterialService } from './category-material.service';
import { CategoryMaterialController } from './category-material.controller';

@Module({
  controllers: [CategoryMaterialController],
  providers: [CategoryMaterialService],
})
export class CategoryMaterialModule {}
