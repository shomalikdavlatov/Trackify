import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { CategorySchema } from './schemas/category.schema';
import { TrackSchema } from './schemas/track.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoDBService implements OnModuleInit {
    constructor(private configService: ConfigService) {}
    public UserModel: mongoose.Model<any>;
    public CategoryModel: mongoose.Model<any>;
    public TrackModel: mongoose.Model<any>;

    async onModuleInit() {
        const uri = this.configService.get<string>('MONGO_URI');
        await mongoose.connect(uri!);
        this.UserModel = mongoose.model('User', UserSchema);
        this.CategoryModel = mongoose.model('Category', CategorySchema);
        this.TrackModel = mongoose.model('Track', TrackSchema);
        console.log('✅ MongoDB connected');
    }
}
