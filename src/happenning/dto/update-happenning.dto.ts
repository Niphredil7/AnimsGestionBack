import { PartialType } from '@nestjs/mapped-types';
import { CreateHappenningDto } from './create-happenning.dto';

export class UpdateHappenningDto extends PartialType(CreateHappenningDto) {}
