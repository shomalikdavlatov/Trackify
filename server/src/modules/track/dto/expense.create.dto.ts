import { IsNotEmpty, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateExpenseDto {
    @IsOptional()
    description?: string;

    @IsNumber()
    amount: number;

    @IsMongoId()
    category: string;
}
