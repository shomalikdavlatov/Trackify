import { IsEmail, IsIn, IsString } from 'class-validator';

export class VerifyCodeDto {
    @IsEmail()
    email: string;

    @IsString()
    code: string;

    @IsIn(['register', 'forgot'])
    purpose: 'register' | 'forgot';
}
