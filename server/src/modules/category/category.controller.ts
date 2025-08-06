import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCategoryDto } from './dto/update.dto';

@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async createCategory(@Body() body: CreateCategoryDto, @Req() req: Request) {
        return await this.categoryService.createCategory(
            body.name,
            req['user']['userId'],
        );
    }

    @Get()
    async getCategories(@Req() req: Request) {
        return await this.categoryService.getCategories(req['user']['userId']);
    }

    @Put(':name')
    async updateCategory(
        @Param('name') name: string,
        @Body() body: UpdateCategoryDto,
        @Req() req: Request,
    ) {
        return await this.categoryService.updateCategory(
            name,
            req['user']['userId'],
            body.name,
        );
    }

    @Delete(':name')
    async deleteCategory(@Param('name') name: string, @Req() req: Request) {
        return await this.categoryService.deleteCategory(
            name,
            req['user']['userId'],
        );
    }
}
