import {
    IsEnum,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
    IsISO8601,
} from 'class-validator';

export class CreateTransactionDto {
    @IsEnum(['income', 'expense'])
    type!: 'income' | 'expense';

    @IsMongoId()
    categoryId: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsISO8601()
    datetime?: string;
}
