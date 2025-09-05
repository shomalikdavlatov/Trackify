import {
    ConflictException,
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';
import { RedisService } from 'src/core/database/redis/redis.service';
import { EmailService } from 'src/core/mailer/mailer.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private db: MongoDBService,
        private redis: RedisService,
        private emailService: EmailService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.db.UserModel.findOne({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async register(email: string, password: string, code: string) {
        const existingUser = await this.db.UserModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const key = `register:${email}`;
        const stored = await this.redis.get(key);
        if (!stored) {
            throw new BadRequestException(
                'Verification code expired or not sent',
            );
        }
        if (stored !== code.trim()) {
            throw new BadRequestException('Invalid verification code');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.db.UserModel.create({
            email,
            password: hashedPassword,
            balance: 0,
        });

        await this.redis.del(key);

        return { message: 'Registered successfully', userId: newUser._id };
    }

    async login(user: any, res: any) {
        const payload = { id: user._id };
        const token = this.jwtService.sign(payload);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: 'lax'
        });

        return { message: 'Logged in successfully' };
    }

    async logout(res: any) {
        res.clearCookie('auth_token');
        return { message: 'Logged out successfully' };
    }

    private generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendRegisterCode(email: string) {
        const existingUser = await this.db.UserModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }
        const code = this.generateCode();
        const key = `register:${email}`;
    
        await this.redis.set(key, code, +(process.env.VERIFICATION_TTL as string));
        await this.emailService.sendVerificationCode(email, 'register', code);
        return { message: 'Verification code sent' };
    }

    async sendResetCode(email: string) {
        const user = await this.db.UserModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('No account with that email');
        }
        const code = this.generateCode();
        const key = `reset:${email}`;
        await this.redis.set(
            key,
            code,
            +(process.env.VERIFICATION_TTL as string),
        );
        await this.emailService.sendVerificationCode(email, 'reset', code);
        return { message: 'Reset code sent' };
    }


    async checkCode(email: string, code: string, type: 'register' | 'reset') {
        const key = `${type}:${email}`;
        const stored = await this.redis.get(key);
        if (!stored) throw new BadRequestException('Code expired or not found');
        if (stored !== code) throw new BadRequestException('Invalid code');
        return { ok: true };
    }

    async resetPassword(email: string, code: string, newPassword: string) {
        await this.checkCode(email, code, 'reset');
        const user = await this.db.UserModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        await this.redis.del(`reset:${email}`);
        return { message: 'Password reset successfully' };
    }

    async getUser(token: string) {
        const {id} = await this.jwtService.decode(token);
        return await this.db.UserModel.findOne({_id: id});
    }
}
