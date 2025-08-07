import { IsNotEmpty, IsString } from "class-validator";

export class ExpenseCategoryCreateDto {
    @IsString() 
    @IsNotEmpty()
    name: string;
}