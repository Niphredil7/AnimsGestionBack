import { HappenningType } from "@prisma/client"
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateHappenningDto {

    @IsNotEmpty()
      @IsString()
    title:string

    @IsNotEmpty()
      @IsString()
    content:string

    @IsNotEmpty()
      @IsDate()
    dateStart:Date

    @IsNotEmpty()
      @IsDate()
    dateEnd:Date

    type:HappenningType

    @IsNotEmpty()
      @IsString()
      @IsUUID()
    creatorId:string
}
