// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { decodeJWT } from 'src/common/utils/functions';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('send-code')
    async sendRegisterCode(@Body() body: { email: string }) {
        return this.authService.sendRegisterCode(body.email);
    }

    // Client must pass email + password + code
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

    // Reset / forgot password endpoints
    @Post('send-reset-code')
    async sendResetCode(@Body() body: { email: string }) {
        return this.authService.sendResetCode(body.email);
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: { email: string; code: string; newPassword: string },
    ) {
        const { email, code, newPassword } = body;
        return this.authService.resetPassword(email, code, newPassword);
    }

    // Generic check (optional)
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
        // console.log(decodeJWT(req.cookies.auth_token));
        const token = (req as any).cookies?.auth_token;
        if (!token) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
