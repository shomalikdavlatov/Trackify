export type TxType = "income" | "expense";


export interface Category {
id: string;
name: string;
type: TxType; 
}


export interface Transaction {
id: string;
type: TxType;
category: string;
amount: number;
note?: string;
datetime: string;
}