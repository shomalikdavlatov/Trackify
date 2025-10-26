import { IsEmail, IsIn, IsString, Length, MinLength } from "class-validator";
import { currencies } from "src/common/utils/types";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsIn(currencies)
    currency: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @Length(6, 6)
    code: string;
}