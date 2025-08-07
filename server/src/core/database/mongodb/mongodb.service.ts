import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IncomeSchema } from './schemas/income.schema';
import { ExpenseSchema } from './schemas/expense.schema';
import { IncomeCategorySchema } from './schemas/incomeCategory.schema';
import { ExpenseCategorySchema } from './schemas/expenseCategory.schema';

@Injectable()
export class MongoDBService implements OnModuleInit {
    constructor(private configService: ConfigService) {}
    public UserModel: mongoose.Model<any>;
    public IncomeModel: mongoose.Model<any>;
    public ExpenseModel: mongoose.Model<any>;
    public IncomeCategoryModel: mongoose.Model<any>;
    public ExpenseCategoryModel: mongoose.Model<any>;

    async onModuleInit() {
        const uri = this.configService.get<string>('MONGO_URI');
        await mongoose.connect(uri!);
        this.UserModel = mongoose.model('User', UserSchema);
        this.IncomeModel = mongoose.model('Income', IncomeSchema);
        this.ExpenseModel = mongoose.model('Expense', ExpenseSchema);
        this.IncomeCategoryModel = mongoose.model(
            'IncomeCategory',
            IncomeCategorySchema,
        );
        this.ExpenseCategoryModel = mongoose.model(
            'ExpenseCategory',
            ExpenseCategorySchema,
        );
        console.log('✅ MongoDB connected');
    }
}
