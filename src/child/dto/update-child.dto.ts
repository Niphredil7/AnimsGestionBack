import { PartialType } from '@nestjs/mapped-types';
import { CreateChildDto } from './create-child.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActivityForbidenn, GenreChild, Regime } from '@prisma/client';

export class UpdateChildDto extends PartialType(CreateChildDto) {

}
