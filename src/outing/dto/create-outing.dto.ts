import { Favorite } from '@prisma/client';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOutingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsNotEmpty()
  favorite: Favorite;
  
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsDate()
  @IsOptional()
  validatedAt?: Date;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  planningId: string;
}
