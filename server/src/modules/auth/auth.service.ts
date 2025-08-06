// auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private db: MongoDBService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.db.UserModel.findOne({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async register(email: string, password: string) {
        const existingUser = await this.db.UserModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.db.UserModel.create({
            email,
            password: hashedPassword,
        });

        return { message: 'Registered successfully', userId: newUser._id };
    }

    async login(user: any, res: any) {
        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false, 
            maxAge: 24 * 60 * 60 * 1000,
        });

        return { message: 'Logged in successfully' };
    }

    async logout(res: any) {
        res.clearCookie('auth_token');
        return { message: 'Logged out' };
    }
}
