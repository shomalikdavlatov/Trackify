import { IsNotEmpty, IsNumber, IsMongoId, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: 'Amount must be greater than 0' })
    amount: number;

    @IsNotEmpty()
    @IsMongoId()
    category: string;
}
