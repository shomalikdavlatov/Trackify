import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('send-code')
    async sendRegisterCode(@Body() body: { email: string }) {
        return this.authService.sendRegisterCode(body.email);
    }

    @Post('register')
    async register(
        @Body() body: { email: string; password: string; code: string },
    ) {
        const { email, password, code } = body;
        return this.authService.register(email, password, code);
    }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );
        return this.authService.login(user, res);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Post('send-reset-code')
    async sendResetCode(@Body() body: { email: string }) {
        return this.authService.sendResetCode(body.email);
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: ResetPasswordDto,
    ) {
        const { email, code, newPassword } = body;
        return this.authService.resetPassword(email, code, newPassword);
    }

    @Post('check-code')
    async checkCode(
        @Body()
        body: {
            email: string;
            code: string;
            type: 'register' | 'reset';
        },
    ) {
        return this.authService.checkCode(body.email, body.code, body.type);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    me(@Req() req: Request) {
        const token = (req as any).cookies?.auth_token;
        if (!token) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
