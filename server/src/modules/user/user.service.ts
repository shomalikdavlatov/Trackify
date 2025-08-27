import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class UserService {
    constructor(private db: MongoDBService, private jwtService: JwtService) {}

    async getUserData(token: string) {
        const {id} = this.jwtService.decode(token);
        const user = await this.db.UserModel.findById(id).select("balance email");
        const categories = await this.db.CategoryModel.find({ user: user._id });
        const transactions = await this.db.TransactionModel.find({ user: user._id });

        return {
            user,
            categories,
            transactions
        }
    }
}
