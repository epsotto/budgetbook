export type BookRole = 'owner' | 'editor' | 'viewer';

export interface BudgetBook {
	bookId: string;
	name: string;
	role: BookRole;
}
