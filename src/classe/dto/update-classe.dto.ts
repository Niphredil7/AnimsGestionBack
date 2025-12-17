import { PartialType } from '@nestjs/mapped-types';
import { CreateClasseDto } from './create-classe.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClasseDto extends PartialType(CreateClasseDto) {

}
