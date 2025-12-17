import { UserRole, UserStatus, Visible } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {

      @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
            minUppercase: 1,
            minLength: 8,
            minNumbers: 1,
            minSymbols: 1,
        })
  password: string;

  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  lastname: string;

    @IsOptional()
  @IsString()
  address:string

  @IsOptional()
  @IsNumber()
  zipCode?:number

  @IsOptional()
  @IsString()
  city:string


  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  cv: string;

  @IsOptional()
  @IsString()
  visibility: Visible;

  role : UserRole

  @IsOptional()
  @IsString()
  photo?:string
  
  @IsOptional()
  @IsString()
  schoolId:string
  
  @IsOptional()
  @IsString()
  available?:string
  
  content?:string

  status: UserStatus
}


  

  