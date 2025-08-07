import { IsOptional, IsNumber, IsMongoId } from 'class-validator';

export class UpdateExpenseDto {
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsMongoId()
    category?: string;
}
