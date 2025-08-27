import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private jwtService: JwtService,
    ) {}

    @Post()
    create(@Body() body: CreateCategoryDto, @Req() req: Request) {
        const { id } = this.jwtService.decode(req.cookies.auth_token);
        return this.categoryService.create(body, id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: UpdateCategoryDto,
        @Req() req: Request,
    ) {
        const { id: userId } = this.jwtService.decode(req.cookies.auth_token);
        return this.categoryService.update(id, body, userId);
      }
      
      @Delete(':id')
      remove(@Param('id') id: string, @Req() req: Request) {
      const { id: userId } = this.jwtService.decode(req.cookies.auth_token);
        return this.categoryService.remove(id, userId);
    }
}
