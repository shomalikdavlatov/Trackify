import { IsOptional, IsNumber, IsMongoId } from 'class-validator';

export class UpdateIncomeDto {
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsMongoId()
    category?: string;
}
