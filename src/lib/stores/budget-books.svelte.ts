import { getContext, setContext } from 'svelte';
import type { BudgetBook } from '@/types/Books/budget-book';

const BUDGET_BOOKS_CONTEXT = Symbol('budget-books');

/**
 * Creates the in-memory budget book store.
 *
 * This is intentionally backed by sample data for now. When the backend is
 * ready, swap the mutation functions for form actions or API calls while
 * keeping the same shape so components do not need to change.
 */
export function createBudgetBookStore(initialBooks: BudgetBook[]) {
	let books = $state<BudgetBook[]>(initialBooks.map((book) => ({ ...book })));
	let activeBookId = $state<string | null>(initialBooks[0]?.bookId ?? null);

	function selectBook(bookId: string) {
		if (books.some((book) => book.bookId === bookId)) {
			activeBookId = bookId;
		}
	}

	function addBook(name: string) {
		const trimmedName = name.trim();
		if (!trimmedName) return null;

		const book: BudgetBook = {
			bookId: crypto.randomUUID(),
			name: trimmedName
		};

		books = [...books, book];
		activeBookId = book.bookId;
		return book;
	}

	function renameBook(bookId: string, name: string) {
		const trimmedName = name.trim();
		if (!trimmedName) return;

		books = books.map((book) => (book.bookId === bookId ? { ...book, name: trimmedName } : book));
	}

	function deleteBook(bookId: string) {
		const deletedIndex = books.findIndex((book) => book.bookId === bookId);
		if (deletedIndex === -1) return;

		books = books.filter((book) => book.bookId !== bookId);

		if (activeBookId !== bookId) return;

		// Prefer the next book, then the previous one, and finally no selection.
		const nextBook = books[deletedIndex] ?? books[deletedIndex - 1] ?? null;
		activeBookId = nextBook?.bookId ?? null;
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
		selectBook,
		addBook,
		renameBook,
		deleteBook
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
