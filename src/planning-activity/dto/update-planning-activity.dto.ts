import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanningActivityDto } from './create-planning-activity.dto';

export class UpdatePlanningActivityDto extends PartialType(CreatePlanningActivityDto) {}
