import { IsNotEmpty, IsString } from "class-validator";

export class IncomeCategoryCreateDto {
    @IsString() 
    @IsNotEmpty()
    name: string;
}