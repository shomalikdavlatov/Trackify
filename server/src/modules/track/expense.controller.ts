import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/expense.create.dto';
import { UpdateExpenseDto } from './dto/expense.update.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('expense')
@UseGuards(AuthGuard('jwt'))
export class ExpenseController {
    constructor(private readonly service: ExpenseService) {}

    @Post()
    async create(@Body() dto: CreateExpenseDto, @Req() req: Request) {
        console.log(dto);
        const userId = req['user']['userId'];
        return this.service.create({ ...dto, user: userId });
    }

    @Get()
    async get(
        @Req() req: Request,
        @Query('category') category?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('thisMonth') thisMonth?: string,
    ) {
        const userId = req['user']['userId'];

        if (thisMonth === 'true') {
            return this.service.getThisMonth(userId);
        }

        if (from && to) {
            return this.service.getByDate(userId, new Date(from), new Date(to));
        }

        return this.service.getAll(userId, category);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateExpenseDto,
        @Req() req: Request,
    ) {
        const userId = req['user']['userId'];
        return this.service.update(id, { ...dto, user: userId });
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: Request) {
        const userId = req['user']['userId'];
        return this.service.delete(id, userId);
    }
}
