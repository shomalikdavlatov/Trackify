import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsIn(["income", "expense"])
    type: string;
}
