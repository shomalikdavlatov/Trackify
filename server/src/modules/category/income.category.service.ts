import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class IncomeCategoryService {
    constructor(private db: MongoDBService) {}

    async create(name: string, userId: string) {
        const category = await this.db.IncomeCategoryModel.findOne({
            name,
            user: userId,
        });
        if (category)
            throw new ConflictException(
                'Income category with this name already exists!',
            );

        return await this.db.IncomeCategoryModel.create({ name, user: userId });
    }

    async get(userId: string) {
        const categories = await this.db.IncomeCategoryModel.find({
            user: userId,
        });

        return categories;
    }

    async update(id: string, userId: string, newName: string) {
        const existingCategory = await this.db.IncomeCategoryModel.findOne({
            _id: id,
        });
        if (!existingCategory) {
            throw new NotFoundException('Original income category not found.');
        }

        const category = await this.db.IncomeCategoryModel.findOne({
            name: newName,
            user: userId,
        });
        if (category)
            throw new BadRequestException(
                'Income category with the new name already exists!',
            );

        return await this.db.IncomeCategoryModel.updateOne(
            { _id: id },
            { name: newName },
        );
    }

    async delete(id: string) {
        const category = await this.db.IncomeCategoryModel.findOne({
            _id: id,
        });
        if (!category)
            throw new NotFoundException(
                'Income category with the specified id not found!',
            );

        await this.db.IncomeModel.deleteMany({category: id});
        await this.db.IncomeCategoryModel.deleteOne({ _id: id });

        return {
            message: 'Income category deleted successfully!',
        };
    }
}
