import { SchoolType } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateSchoolDto {

    @IsNotEmpty()
      @IsString()
   name:string
   @IsNotEmpty()
      @IsString()
  address:string

  @IsNotEmpty()
      @IsNumber()
  zipCode:number 

  @IsNotEmpty()
      @IsString()
  city:string

  @IsNotEmpty()
  type: SchoolType 
}
