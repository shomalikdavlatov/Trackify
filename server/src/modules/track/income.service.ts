import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class IncomeService {
    constructor(private db: MongoDBService) {}

    async create(dto: any) {
        const user = await this.db.UserModel.find({ _id: dto.user });
        await this.db.UserModel.updateOne(
            { user: dto.user },
            { balance: user['balance'] + dto.amount },
        );
        return await this.db.IncomeModel.create(dto);
    }

    async getAll(userId: string) {
        return await this.db.IncomeModel.find({ user: userId });
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
        if (!income) throw new NotFoundException('Income not found');

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
        if (!income) throw new NotFoundException('Income not found');

        const user = await this.db.UserModel.findOne({ _id: userId });
        await this.db.UserModel.updateOne(
            { _id: userId },
            { balance: user.balance - income.amount },
        );

        return {
            message: "Income deleted successfully!"
        }
    }
}
