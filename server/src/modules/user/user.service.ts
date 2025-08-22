import { Injectable } from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class UserService {
    constructor(private db: MongoDBService) {}

    async getUserData(userId: string) {
        const user = await this.db.UserModel.findById(userId).select("balance email");
        return user;
    }
}
