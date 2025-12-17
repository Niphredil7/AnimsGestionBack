import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Visible } from '@prisma/client';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ["password", "role", "status", "schoolId"] as const),) {
 
}
