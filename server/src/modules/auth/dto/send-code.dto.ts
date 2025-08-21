import { IsEmail, IsIn } from 'class-validator';

export class SendCodeDto {
    @IsEmail()
    email: string;

    @IsIn(['register', 'forgot'])
    purpose: 'register' | 'forgot';
}
