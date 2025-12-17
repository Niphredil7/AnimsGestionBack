import { ActivityForbidenn, Regime, GenreChild } from "@prisma/client"
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateChildDto {

    @IsNotEmpty()
      @IsString()
    firstName:string

    @IsNotEmpty()
      @IsString()
    lastName:string

    @IsBoolean()
    @IsNotEmpty()
    allergen: boolean

    @IsOptional()
    regime: Regime

    @IsNotEmpty()
    sexe: GenreChild

    @IsOptional()
    activityForbiden: ActivityForbidenn

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    schoolId: string;
    
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    classId:string
}




  
  