import type { TransactionItem } from './transaction-item';

export interface Merchant {
	id: string;
	name: string;
	categoryId: string;
	transactions: TransactionItem[];
}
