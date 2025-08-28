import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MongoDBService } from 'src/core/database/mongodb/mongodb.service';

@Injectable()
export class CategoryService {
    constructor(private db: MongoDBService) {}

    async create(body: CreateCategoryDto, id: string) {
        const user = await this.db.UserModel.findById(id).lean();
        if (!user) throw new NotFoundException('No account with that id');

        const category = await this.db.CategoryModel.findOne({
            ...body,
            user: id,
        }).lean();
        if (category)
            throw new ConflictException(
                'There is already a category with specified name',
            );

        return await this.db.CategoryModel.create({
            ...body,
            user: id,
        });
    }

    async findAll(id: string) {
        const category = await this.db.CategoryModel.find({user: id}).lean();
        return category;
    }

    async findOne(id: string) {
        const category = await this.db.CategoryModel.findById(id).lean();
        if (!category) throw new NotFoundException('No category with that id');

        return category;
    }

    async update(id: string, body: UpdateCategoryDto, userId: string) {
      const category = await this.db.CategoryModel.findById(id);
      if (!category) throw new NotFoundException("No category with that id");

      if (category.user.toString() !== userId) throw new ForbiddenException();
      
      const check = await this.db.CategoryModel.findOne({...category, ...body});
      if (check) throw new ConflictException(
        'There is already a category with specified name',
      );
      
      return await this.db.CategoryModel.updateOne({_id: id}, body);
    }
    
    async remove(id: string, userId: string) {
      const category = await this.db.CategoryModel.findById(id);
      if (!category) throw new NotFoundException("No category with that id");
  
      if (category.user.toString() !== userId) throw new ForbiddenException();

      await this.db.CategoryModel.deleteOne({_id: id});
      return "Category deleted successfully!";
    }
}
