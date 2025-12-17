import { EMoment } from "@prisma/client"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"

export class CreatePlanningActivityDto {

    @IsNotEmpty()
    moment: EMoment

    @IsOptional()
    @IsDate()
    validatedAt?:Date

    @ValidateIf(dto => !dto.outingId)
    @IsOptional()
    @IsString()
    activityId?:string

    @ValidateIf(dto => !dto.activityId)
    @IsOptional()
    @IsString()
    outingId?:string

    @IsOptional()
    // @IsNotEmpty()
    @IsString()
    planningId?:string

    @IsNotEmpty()
    @IsString()
    classId:string

    @IsNotEmpty()
    @IsNumber()
    day:number
}


