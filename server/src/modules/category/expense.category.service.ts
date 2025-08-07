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

        return await this.db.ExpenseCategoryModel.create({ name, user: userId });
    }

    async get(userId: string) {
        const categories = await this.db.ExpenseCategoryModel.find({
            user: userId,
        });

        return categories;
    }

    async update(id: string, userId: string, newName: string) {
        const existingCategory = await this.db.ExpenseCategoryModel.findOne({
            _id: id,
        });
        if (!existingCategory) {
            throw new NotFoundException('Original expense category not found.');
        }

        const category = await this.db.ExpenseCategoryModel.findOne({
            name: newName,
            user: userId,
        });
        if (category)
            throw new BadRequestException(
                'Expense category with the new name already exists!',
            );

        return await this.db.ExpenseCategoryModel.updateOne(
            { _id: id },
            { name: newName },
        );
    }

    async delete(id: string) {
        const category = await this.db.ExpenseCategoryModel.findOne({
            _id: id,
        });
        if (!category)
            throw new NotFoundException(
                'Expense category with the specified id not found!',
            );

        await this.db.ExpenseCategoryModel.deleteOne({ _id: id });
        await this.db.ExpenseModel.deleteMany({category: id});

        return {
            message: 'Expense category deleted successfully!',
        };
    }
}
