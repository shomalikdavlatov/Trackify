import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeCurrencyDto } from './dto/change-currency.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUserData(@Req() req: Request) {
        return await this.userService.getUser(req);
    }

    @Put("change-password")
    @UseGuards(AuthGuard('jwt'))
    async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
        return this.userService.changePassword(body, req);
    }

    @Put("change-currency")
    @UseGuards(AuthGuard('jwt'))
    async changeCurrency(@Body() body: ChangeCurrencyDto, @Req() req: Request) {
        return this.userService.changeCurrency(body.currency, req);
    }
}
