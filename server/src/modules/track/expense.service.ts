import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class ExpenseService {
    constructor(private db: MongoDBService) {}

    async create(dto: any) {
        const category = await this.db.ExpenseCategoryModel.findOne({
            _id: dto.category,
        });
        if (!category)
            throw new NotFoundException('Expense category not found!');

        const user = await this.db.UserModel.findOne({ _id: dto.user });
        await this.db.UserModel.updateOne(
            { _id: dto.user },
            { balance: user['balance'] - dto.amount },
        );

        return await this.db.ExpenseModel.create(dto);
    }

    async getAll(userId: string, category?: string) {
        const filter: any = { user: userId };
        if (category) {
            if (!Types.ObjectId.isValid(category!))
                throw new BadRequestException(
                    'Expense category id is invalid!',
                );

            const check = await this.db.ExpenseCategoryModel.findOne({
                _id: category,
            });
            if (!check)
                throw new NotFoundException('Expense category not found!');

            filter.category = category;
        }

        return await this.db.ExpenseModel.find(filter);
    }

    async getByDate(userId: string, from: Date, to: Date) {
        return await this.db.ExpenseModel.find({
            user: userId,
            createdAt: { $gte: from, $lte: to },
        });
    }

    async getThisMonth(userId: string) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return await this.getByDate(userId, firstDay, lastDay);
    }

    async update(id: string, dto: any) {
        const expense = await this.db.ExpenseModel.findOne({ _id: id });
        if (!expense) throw new NotFoundException('Expense not found!');

        if (dto.category) {
            const category = await this.db.ExpenseCategoryModel.findOne({
                _id: id,
            });
            if (!category)
                throw new NotFoundException('Expense category not found!');
        }

        if (dto.amount) {
            const user = await this.db.UserModel.findOne({ _id: dto.user });
            await this.db.UserModel.updateOne(
                { _id: dto.user },
                { balance: user.balance + expense.amount - dto.amount },
            );
        }

        return await this.db.ExpenseModel.updateOne({ _id: id }, dto);
    }

    async delete(id: string, userId: string) {
        const expense = await this.db.ExpenseModel.findOne({ _id: id });
        if (!expense) throw new NotFoundException('Expense not found!');

        const user = await this.db.UserModel.findOne({ _id: userId });
        await this.db.UserModel.updateOne(
            { _id: userId },
            { balance: user.balance + expense.amount },
        );

        return {
            message: 'Expense deleted successfully!',
        };
    }
}
