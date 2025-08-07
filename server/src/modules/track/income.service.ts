import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class IncomeService {
    constructor(private db: MongoDBService) {}

    async create(dto: any) {
        const category = await this.db.IncomeCategoryModel.findOne({
            _id: dto.category,
        });
        if (!category)
            throw new NotFoundException('Income category not found!');

        const user = await this.db.UserModel.findOne({ _id: dto.user });
        await this.db.UserModel.updateOne(
            { _id: dto.user },
            { balance: user['balance'] + dto.amount },
        );

        return await this.db.IncomeModel.create(dto);
    }

    async getAll(userId: string, category?: string) {
        const filter: any = { user: userId };
        if (category) {
            if (!Types.ObjectId.isValid(category!))
                throw new BadRequestException('Income category id is invalid!');

            const check = await this.db.IncomeCategoryModel.findOne({
                _id: category,
            });
            if (!check)
                throw new NotFoundException('Income category not found!');

            filter.category = category;
        }

        return await this.db.IncomeModel.find(filter);
    }

    async getByDate(userId: string, from: Date, to: Date) {
        return await this.db.IncomeModel.find({
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
        const income = await this.db.IncomeModel.findOne({ _id: id });
        if (!income) throw new NotFoundException('Income not found!');

        if (dto.category) {
            const category = await this.db.IncomeCategoryModel.findOne({
                _id: dto.category,
            });
            if (!category)
                throw new NotFoundException('Income category not found!');
        }

        if (dto.amount) {
            const user = await this.db.UserModel.findOne({ _id: dto.user });
            await this.db.UserModel.updateOne(
                { _id: dto.user },
                { balance: user.balance - income.amount + dto.amount },
            );
        }

        return await this.db.IncomeModel.updateOne({ _id: id }, dto);
    }

    async delete(id: string, userId: string) {
        const income = await this.db.IncomeModel.findOne({ _id: id });
        if (!income) throw new NotFoundException('Income not found!');

        const user = await this.db.UserModel.findOne({ _id: userId });
        await this.db.UserModel.updateOne(
            { _id: userId },
            { balance: user.balance - income.amount },
        );

        return {
            message: 'Income deleted successfully!',
        };
    }
}
