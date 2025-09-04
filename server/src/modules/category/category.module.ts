import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [JwtModule, TransactionModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
