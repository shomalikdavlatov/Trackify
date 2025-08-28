import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Req,
    Put,
    UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private jwtService: JwtService,
    ) {}

    @Post()
    create(@Body() body: CreateTransactionDto, @Req() req: Request) {
        const { id } = this.jwtService.decode(req.cookies.auth_token);
        return this.transactionService.create(body, id);
    }

    @Get()
    findAll(@Req() req: Request) {
        const { id } = this.jwtService.decode(req.cookies.auth_token);
        return this.transactionService.findAll(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        const { id: userId } = this.jwtService.decode(req.cookies.auth_token);
        return this.transactionService.findOne(id, userId);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: UpdateTransactionDto,
        @Req() req: Request,
    ) {
        const { id: userId } = this.jwtService.decode(req.cookies.auth_token);
        return this.transactionService.update(id, body, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        const { id: userId } = this.jwtService.decode(req.cookies.auth_token);
        return this.transactionService.remove(id, userId);
    }
}
