import { UserRole, UserStatus, Visible } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
            minUppercase: 1,
            minLength: 8,
            minNumbers: 1,
            minSymbols: 1,
        })
  password: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

    @IsOptional()
  @IsString()
  address?:string

  @IsOptional()
  @IsNumber()
  zipCode?:number

  @IsNotEmpty()
  @IsString()
  city:string


  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cv?: string;

  @IsString()
  visibility: Visible;

  role : UserRole

  @IsOptional()
  @IsString()
  photo?:string
  
  @IsOptional()
  @IsString()
  @IsUUID()
  schoolId?:string
  
  @IsOptional()
  @IsString()
  available?:string
  
  @IsOptional()
  @IsString()
  content?:string

  status: UserStatus
}
