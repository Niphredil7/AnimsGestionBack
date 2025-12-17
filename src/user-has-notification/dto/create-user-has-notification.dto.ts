import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserHasNotificationDto {

    @IsBoolean()
    seen:boolean

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    notificationId:string

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    userId:string
}
