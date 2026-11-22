import { getContext, setContext, untrack } from 'svelte';
import type { BudgetBook } from '@/types/Books/budget-book';

const BUDGET_BOOKS_CONTEXT = Symbol('budget-books');

/**
 * Client-side cache of the books returned by `(app)/+layout.server.ts`.
 * Mutations go through SvelteKit form actions; the layout load re-runs and
 * syncs this store via `setBooks`.
 */
export function createBudgetBookStore(initialBooks: BudgetBook[]) {
	function normalizeBooks(input: unknown): BudgetBook[] {
		if (!Array.isArray(input)) return [];
		return input
			.filter(
				(book): book is BudgetBook =>
					Boolean(book && typeof book === 'object' && 'bookId' in book && book.bookId)
			)
			.map((book) => ({ ...book }));
	}

	function sameBooks(a: BudgetBook[], b: BudgetBook[]) {
		if (a === b) return true;
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i += 1) {
			if (a[i].bookId !== b[i].bookId || a[i].name !== b[i].name || a[i].role !== b[i].role) {
				return false;
			}
		}
		return true;
	}

	let books = $state<BudgetBook[]>(normalizeBooks(initialBooks));
	let activeBookId = $state<string | null>(null);

	function setBooks(nextBooks: BudgetBook[]) {
		const normalized = normalizeBooks(nextBooks);
		const currentBooks = untrack(() => books);
		if (!sameBooks(currentBooks, normalized)) {
			books = normalized;
		}

		const currentActiveBookId = untrack(() => activeBookId);
		if (
			currentActiveBookId &&
			!normalized.some((book) => book.bookId === currentActiveBookId)
		) {
			activeBookId = null;
		}
	}

	function selectBook(bookId: string | null) {
		if (bookId === null) {
			activeBookId = null;
			return;
		}
		if (books.some((book) => book.bookId === bookId)) {
			activeBookId = bookId;
		}
	}

	return {
		get books() {
			return books;
		},
		get activeBookId() {
			return activeBookId;
		},
		get activeBook() {
			return books.find((book) => book.bookId === activeBookId) ?? null;
		},
		setBooks,
		selectBook
	};
}

export type BudgetBookStore = ReturnType<typeof createBudgetBookStore>;

export function setBudgetBookStore(store: BudgetBookStore) {
	setContext(BUDGET_BOOKS_CONTEXT, store);
	return store;
}

export function getBudgetBookStore() {
	const store = getContext<BudgetBookStore | undefined>(BUDGET_BOOKS_CONTEXT);
	if (!store) {
		throw new Error('getBudgetBookStore() must be called inside a descendant of the (app) layout.');
	}
	return store;
}
