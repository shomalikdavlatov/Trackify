import { IsNotEmpty, IsString } from "class-validator";

export class IncomeCategoryUpdateDto {
    @IsString() 
    @IsNotEmpty()
    name: string;
}