import { IsStrongPassword } from "class-validator";

export class PasswordUpdateDto {
    @IsStrongPassword({
                minUppercase: 1,
                minLength: 8,
                minNumbers: 1,
                minSymbols: 1,
            })
      password: string;
}