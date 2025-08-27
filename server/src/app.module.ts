import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [CoreModule, AuthModule, UserModule, CategoryModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
