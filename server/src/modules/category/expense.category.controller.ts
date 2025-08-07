import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExpenseCategoryService } from "./expense.category.service";
import { Request } from "express";
import { ExpenseCategoryCreateDto } from "./dto/expense.category.create.dto";
import { ExpenseCategoryUpdateDto } from "./dto/expense.category.update.dto";

@Controller('category/expense')
@UseGuards(AuthGuard('jwt'))
export class ExpenseCategoryController {
    constructor(private service: ExpenseCategoryService) {}
    @Post()
    async create(@Body() body: ExpenseCategoryCreateDto, @Req() req: Request) {
        return await this.service.create(body.name, req['user']['userId']);
    }
    @Get()
    async get(@Req() req: Request) {
        return await this.service.get(req['user']['userId']);
    }
    @Put(":id")
    async update(@Param('id') id: string, @Body() body: ExpenseCategoryUpdateDto, @Req() req: Request) {
        return await this.service.update(
            id,
            req['user']['userId'],
            body.name,
        );
    }
    @Delete(":id")
    async delete(@Param('id') id: string, @Req() req: Request) {
        return await this.service.delete(id);
    }
}