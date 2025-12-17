import { Favorite, PlanningActivity } from "@prisma/client"
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateActivityDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    content?:string


    @IsNotEmpty()
    favorite:Favorite

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    userId:string 

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    roomId:string

    @IsString()
    @IsOptional()
    categoryMaterialId?:string

    planningActivity:PlanningActivity[]
}


