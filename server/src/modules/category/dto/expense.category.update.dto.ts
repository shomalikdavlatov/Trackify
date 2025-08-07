import { IsNotEmpty, IsString } from "class-validator";

export class ExpenseCategoryUpdateDto {
    @IsString() 
    @IsNotEmpty()
    name: string;
}