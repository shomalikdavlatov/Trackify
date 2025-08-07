import { IsOptional, IsNumber, IsMongoId, Min } from 'class-validator';

export class UpdateIncomeDto {
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Amount must be greater than 0' })
    amount?: number;

    @IsOptional()
    @IsMongoId()
    category?: string;
}
