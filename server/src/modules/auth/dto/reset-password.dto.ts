import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    code: string;

    @MinLength(6)
    @IsString()
    newPassword: string;
}
