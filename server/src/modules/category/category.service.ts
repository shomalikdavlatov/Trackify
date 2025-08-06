import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class CategoryService {
    constructor(private db: MongoDBService) {}

    async createCategory(name: string, userId: string) {
        const category = await this.db.CategoryModel.findOne({
            name: name,
            user: userId,
        });
        if (category) throw new ConflictException('Category already exists!');

        await this.db.CategoryModel.create({
            name: name,
            user: userId,
        });

        return {
            message: 'success',
        };
    }

    async getCategories(userId: string) {
        const result = await this.db.CategoryModel.find({ user: userId });

        return result.map((el) => el.name);
    }

    async updateCategory(name: string, userId: string, newName: string) {
        const category = await this.db.CategoryModel.findOne({
            name: newName,
            user: userId,
        });
        if (category) throw new ConflictException('Category already exists!');

        await this.db.CategoryModel.updateOne(
            { name, user: userId },
            { name: newName },
        );

        return {
            message: 'success',
        };
    }

    async deleteCategory(name: string, userId: string) {
        const category = await this.db.CategoryModel.findOne({
            name,
            user: userId,
        });
        if (!category)
            throw new NotFoundException('Specified category not found!');

        await this.db.CategoryModel.deleteOne({ name, user: userId });

        return {
            message: 'success',
        };
    }
}
