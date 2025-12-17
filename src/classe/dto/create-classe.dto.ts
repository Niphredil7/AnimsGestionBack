import { IsNotEmpty, IsString } from "class-validator";

export class CreateClasseDto {

    @IsNotEmpty()
    @IsString()
    name:string
}
