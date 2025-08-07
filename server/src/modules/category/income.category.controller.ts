import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IncomeCategoryService } from "./income.category.service";
import { Request } from "express";
import { IncomeCategoryCreateDto } from "./dto/income.category.create.dto";
import { IncomeCategoryUpdateDto } from "./dto/income.category.update.dto";

@Controller('category/income')
@UseGuards(AuthGuard('jwt'))
export class IncomeCategoryController {
    constructor(private service: IncomeCategoryService) {}

    @Post()
    async create(@Body() body: IncomeCategoryCreateDto, @Req() req: Request) {
        return await this.service.create(body.name, req['user']['userId']);
    }

    @Get()
    async get(@Req() req: Request) {
        return await this.service.get(req['user']['userId']);
    }

    @Put(":id")
    async update(@Param('id') id: string, @Body() body: IncomeCategoryUpdateDto, @Req() req: Request) {
        return await this.service.update(
            id,
            req['user']['userId'],
            body.name,
        );
    }
    
    @Delete(":id")
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}