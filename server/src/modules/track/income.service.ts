import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';
import { CreateIncomeDto } from './dto/income.create.dto';
import { UpdateIncomeDto } from './dto/income.update.dto';

@Injectable()
export class IncomeService {
    constructor(private db: MongoDBService) {}

    async create(dto: any) {
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
        const updated = await this.db.IncomeModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!updated) throw new NotFoundException('Income not found');
        return updated;
    }

    async delete(id: string) {
        const result = await this.db.IncomeModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('Income not found');
        return result;
    }
}
