import { IsNotEmpty, IsNumber, IsMongoId, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsMongoId()
    category: string;
}
