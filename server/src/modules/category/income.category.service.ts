import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class IncomeCategoryService {
    constructor(private db: MongoDBService) {}
    async create(name: string, userId: string) {
        const category = await this.db.IncomeCategoryModel.findOne({
            name,
            user: userId,
        });
        if (category)
            throw new ConflictException(
                'Income category with this name already exists!',
            );

        await this.db.IncomeCategoryModel.create({ name, user: userId });

        return {
            message: 'success',
        };
    }
    async get(userId: string) {
        const categories = await this.db.IncomeCategoryModel.find({
            user: userId,
        });

        return categories.map((category) => category.name);
    }
    async update(name: string, userId: string, newName: string) {
        const category = await this.db.IncomeCategoryModel.findOne({
            name: newName,
            user: userId,
        });
        const existingCategory = await this.db.IncomeCategoryModel.findOne({
            name,
            user: userId,
        });
        if (!existingCategory) {
            throw new NotFoundException('Original income category not found.');
        }
        if (category)
            throw new BadRequestException(
                'Income category with the new name already exists!',
            );

        await this.db.IncomeCategoryModel.updateOne(
            { name, user: userId },
            { name: newName },
        );

        return {
            message: 'success',
        };
    }
    async delete(name: string, userId: string) {
        const category = await this.db.IncomeCategoryModel.findOne({
            name,
            user: userId,
        });
        if (!category)
            throw new NotFoundException(
                'Income category with the specified name not found!',
            );

        await this.db.IncomeCategoryModel.deleteOne({ name, user: userId });

        return {
            message: 'success',
        };
    }
}
