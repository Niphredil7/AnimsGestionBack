import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryMaterialDto } from './create-category-material.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryMaterialDto extends PartialType(CreateCategoryMaterialDto) {

}
