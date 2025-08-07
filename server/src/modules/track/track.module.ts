import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { IncomeController } from './income.controller';
import { ExpenseController } from './expense.controller';
import { IncomeService } from './income.service';
import { ExpenseService } from './expense.service';

@Module({
  imports: [CoreModule],
  controllers: [IncomeController, ExpenseController],
  providers: [IncomeService, ExpenseService],
})
export class TrackModule {}
