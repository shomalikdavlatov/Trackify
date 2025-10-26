import { Body, Controller, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { ChangeCurrencyDto } from '../user/dto/change-currency.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('register')
    async register(
        @Body() body: RegisterDto,
        @Res({passthrough: true}) res: Response
    ) {
        return this.authService.register(body.email, body.currency, body.password, body.code, res);
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: ResetPasswordDto,
    ) {
        return this.authService.resetPassword(body.email, body.code, body.newPassword);
    }
    
    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(body.email, body.password, res);
    }
    
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }
    
    @Post('send-code')
    async sendCode(@Body() body: SendCodeDto) {
        return this.authService.sendCode(body.email, body.type);
    }
    @Post('verify-code')
    async verifyCode(
        @Body()
        body: VerifyCodeDto
    ) {
        return await this.authService.verifyCode(body.email, body.code, body.type);
    }

    

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async me() {
        return true;
    }
}
