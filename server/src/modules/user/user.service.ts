import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';
import bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class UserService {
    constructor(
        private db: MongoDBService,
        private jwtService: JwtService,
    ) {}

    async changePassword({ oldPassword, newPassword }, req: Request) {
        const user = await this.getUser(req);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new UnauthorizedException('Password is incorrect!');

        const password = await bcrypt.hash(newPassword, 10);
        await this.db.UserModel.updateOne({ _id: user._id }, { password });
    }

    async changeCurrency(currency: string, req: Request) {
        const user = await this.getUser(req);
        await this.db.UserModel.updateOne({ _id: user._id }, { currency });
    }

    async getUser(req: Request) {
        const token = await this.getToken(req);
        const { id } = await this.jwtService.decode(token);
        const user = await this.db.UserModel.findOne({ _id: id });
        if (!user) throw new UnauthorizedException('Please log in again!');
        return user;
    }

    async getToken(req: Request) {
        const token = req.cookies.auth_token;
        if (!token) throw new UnauthorizedException('Please log in again!');
        return token;
    }
}
