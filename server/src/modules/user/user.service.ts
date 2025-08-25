import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class UserService {
    constructor(private db: MongoDBService, private jwtService: JwtService) {}

    async getUserData(token: string) {
        const {id, email} = this.jwtService.decode(token);
        const user = await this.db.UserModel.findById(id).select("balance email");
        const incomes = await this.db.IncomeModel.find({user: user._id});
        const expenses = await this.db.ExpenseModel.find({user: user._id});
        const incomeCategories = await this.db.IncomeCategoryModel.find({user: user._id});
        const expenseCategories = await this.db.ExpenseCategoryModel.find({user: user._id});
        return {
            user,
            incomes,
            expenses,
            incomeCategories,
            expenseCategories
        }
    }
}
