import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}