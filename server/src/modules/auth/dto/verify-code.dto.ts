import { IsString } from 'class-validator';
import { SendCodeDto } from './send-code.dto';

export class VerifyCodeDto extends SendCodeDto {
    @IsString()
    code: string;
}
