import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanningDto } from './create-planning.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePlanningDto extends PartialType(CreatePlanningDto) {

    @IsNotEmpty()
    updatedAt:Date
}
