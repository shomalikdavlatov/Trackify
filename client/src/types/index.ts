export type TxType = "income" | "expense";


export interface Category {
id: string;
name: string;
type: TxType; // income | expense (separate buckets)
}


export interface Transaction {
id: string;
type: TxType;
categoryId: string;
amount: number;
note?: string;
datetime: string; // ISO string; you’ll parse by month
}