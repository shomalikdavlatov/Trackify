import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { CategorySchema } from './schemas/category.schema';
import { TransactionSchema } from './schemas/transaction.schema';

@Injectable()
export class MongoDBService implements OnModuleInit {
    public UserModel: mongoose.Model<any>;
    public CategoryModel: mongoose.Model<any>;
    public TransactionModel: mongoose.Model<any>;
    private logger: Logger = new Logger("Database");

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        const uri = this.configService.get<string>('MONGO_URI');
        await mongoose.connect(uri!);
        this.UserModel = mongoose.model('User', UserSchema);
        this.CategoryModel = mongoose.model('Category', CategorySchema);
        this.TransactionModel = mongoose.model('Transaction', TransactionSchema);
        this.logger.log("MongoDB connected!");
    }
}
