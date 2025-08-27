import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private db: MongoDBService) {}

    async create(body: CreateTransactionDto, userId: string) {
        const user = await this.db.UserModel.findById(userId).lean();
        if (!user) throw new NotFoundException('No account with that id');

        const category = await this.db.CategoryModel.findById(body.categoryId);
        if (!category) throw new NotFoundException('No category with that id');
        if (category.user.toString() !== userId) throw new ForbiddenException();

        if (category.type !== body.type) {
            throw new BadRequestException(
                'Category type must match transaction type',
            );
        }

        const datetime = body.datetime ? new Date(body.datetime) : undefined;

        const tx = await this.db.TransactionModel.create({
            note: body.note?.trim() || undefined,
            amount: body.amount,
            type: body.type,
            user: userId,
            category: category._id,
            ...(datetime ? { datetime } : {}),
        });

        return tx;
    }

    async findOne(id: string, userId: string) {
        const tx = await this.db.TransactionModel.findById(id);
        if (!tx) throw new NotFoundException('No transaction with that id');
        if (tx.user.toString() !== userId) throw new ForbiddenException();
        return tx;
    }

    async update(id: string, body: UpdateTransactionDto, userId: string) {
        const tx = await this.db.TransactionModel.findById(id);
        if (!tx) throw new NotFoundException('No transaction with that id');
        if (tx.user.toString() !== userId) throw new ForbiddenException();

        const nextType = body.type ?? tx.type;
        const nextCategoryId = body.categoryId ?? tx.category.toString();

        if (body.type !== undefined || body.categoryId !== undefined) {
            const category =
                await this.db.CategoryModel.findById(nextCategoryId);
            if (!category)
                throw new NotFoundException('No category with that id');
            if (category.user.toString() !== userId)
                throw new ForbiddenException();
            if (category.type !== nextType) {
                throw new BadRequestException(
                    'Category type must match transaction type',
                );
            }
        }

        const update: any = {};
        if (body.note !== undefined)
            update.note = body.note?.trim() || undefined;
        if (body.amount !== undefined) update.amount = body.amount;
        if (body.type !== undefined) update.type = body.type;
        if (body.categoryId !== undefined) update.category = body.categoryId;
        if (body.datetime !== undefined)
            update.datetime = new Date(body.datetime);

        await this.db.TransactionModel.updateOne({ _id: id }, update);
        return this.db.TransactionModel.findById(id);
    }

    async remove(id: string, userId: string) {
        const tx = await this.db.TransactionModel.findById(id);
        if (!tx) throw new NotFoundException('No transaction with that id');
        if (tx.user.toString() !== userId) throw new ForbiddenException();

        await this.db.TransactionModel.deleteOne({ _id: id });
        return 'Transaction deleted successfully!';
    }
}
