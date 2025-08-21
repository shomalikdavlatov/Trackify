import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private mailerService: NestMailerService) {}
    async sendVerificationCode(to: string, subject: string, code: string) {
        await this.mailerService.sendMail({
            to,
            subject,
            template: 'verification-code',
            context: {
                code,
            },
        });
    }
}
