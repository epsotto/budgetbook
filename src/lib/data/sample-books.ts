import type { BudgetBook } from '@/types/Books/budget-book';

/**
 * Temporary in-memory sample books.
 * Replace this with books loaded from the server once the backend is wired up.
 */
export const SAMPLE_BOOKS: BudgetBook[] = [
	{ bookId: 'book-personal-2026', name: 'Personal 2026' },
	{ bookId: 'book-house-reno', name: 'House Reno' },
	{ bookId: 'book-business-2026', name: 'Business 2026' }
];
