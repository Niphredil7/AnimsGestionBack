import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class SigninDto {

@IsNotEmpty()
@IsEmail()
    email:string
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minUppercase: 1,
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
    })
    password:string
}