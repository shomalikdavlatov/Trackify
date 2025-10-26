import { IsIn } from "class-validator";
import { currencies } from "src/common/utils/types";

export class ChangeCurrencyDto {
    @IsIn(currencies)
    currency: string;
}