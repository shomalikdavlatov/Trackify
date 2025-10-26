import { IsEmail, IsIn } from 'class-validator';

export class SendCodeDto {
    @IsEmail()
    email: string;

    @IsIn(['Register', 'Reset'])
    type: 'Register' | 'Reset';
}
