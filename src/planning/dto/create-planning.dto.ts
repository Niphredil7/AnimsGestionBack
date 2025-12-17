import { Transform, Type } from "class-transformer"
import { IsDate, IsNotEmpty } from "class-validator"

export class CreatePlanningDto {

    // @Transform(({value}) => {return Date.parse(value)})
    @Type(()=>Date)
    @IsNotEmpty()
    @IsDate()
    dateStart:Date

}


