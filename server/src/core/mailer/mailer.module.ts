import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './mailer.service';

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: parseInt(process.env.MAIL_PORT!),
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                },
                defaults: {
                    from: process.env.MAIL_FROM,
                },
                template: {
                    dir: process.cwd() + '/templates',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
