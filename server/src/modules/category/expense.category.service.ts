import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class ExpenseCategoryService {
    constructor(private db: MongoDBService) {}
    async create(name: string, userId: string) {
        const category = await this.db.ExpenseCategoryModel.findOne({
            name,
            user: userId,
        });
        if (category)
            throw new ConflictException(
                'Expense category with this name already exists!',
            );

        await this.db.ExpenseCategoryModel.create({ name, user: userId });

        return {
            message: 'success',
        };
    }
    async get(userId: string) {
        const categories = await this.db.ExpenseCategoryModel.find({
            user: userId,
        });

        return categories.map((category) => category.name);
    }
    async update(name: string, userId: string, newName: string) {
        const category = await this.db.ExpenseCategoryModel.findOne({
            name: newName,
        });
        if (category)
            throw new BadRequestException(
                'Expense category with the new name already exists!',
            );

        await this.db.ExpenseCategoryModel.updateOne(
            { name, user: userId },
            { name: newName },
        );

        return {
            message: 'success',
        };
    }
    async delete(name: string, userId: string) {
        const category = await this.db.ExpenseCategoryModel.findOne({
            name,
            user: userId,
        });
        if (!category)
            throw new NotFoundException(
                'Expense category with the specified name not found!',
            );

        await this.db.ExpenseCategoryModel.deleteOne({ name, user: userId });

        return {
            message: 'success',
        };
    }
}
