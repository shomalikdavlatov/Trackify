import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { IncomeCategoryController } from './income.category.controller';
import { ExpenseCategoryController } from './expense.category.controller';
import { IncomeCategoryService } from './income.category.service';
import { ExpenseCategoryService } from './expense.category.service';

@Module({
  imports: [CoreModule],
  controllers: [IncomeCategoryController, ExpenseCategoryController],
  providers: [IncomeCategoryService, ExpenseCategoryService],
})
export class CategoryModule {}
