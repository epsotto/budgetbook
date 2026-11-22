import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import {
	createBook,
	deleteBook,
	getBookForUser,
	isBookId,
	listBooksForUser,
	renameBook,
	validateBookName
} from './books';

function requireUser(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}
	return event.locals.user;
}

function getString(formData: FormData, key: string): string {
	const value = formData.get(key);
	return typeof value === 'string' ? value : '';
}

export const bookActions: Actions = {
	createBook: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();
		const name = getString(formData, 'name').trim();
		const validationError = validateBookName(name);

		if (validationError) {
			return fail(400, { action: 'createBook', success: false, message: validationError, name });
		}

		const book = await createBook(name, user.id);

		return {
			action: 'createBook',
			success: true,
			bookId: book.bookId,
			name: book.name
		};
	},

	renameBook: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();
		const bookId = getString(formData, 'bookId');
		const name = getString(formData, 'name').trim();
		const validationError = validateBookName(name);

		if (!isBookId(bookId)) {
			return fail(400, { action: 'renameBook', success: false, message: 'Invalid book id.', bookId });
		}

		if (validationError) {
			return fail(400, {
				action: 'renameBook',
				success: false,
				message: validationError,
				bookId,
				name
			});
		}

		const result = await renameBook(bookId, name, user.id);
		if (result === 'not_found') {
			return fail(404, {
				action: 'renameBook',
				success: false,
				message: 'Book not found.',
				bookId
			});
		}
		if (result === 'forbidden') {
			return fail(403, {
				action: 'renameBook',
				success: false,
				message: 'You do not have permission to rename this book.',
				bookId
			});
		}

		return { action: 'renameBook', success: true, bookId, name };
	},

	deleteBook: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();
		const bookId = getString(formData, 'bookId');

		if (!isBookId(bookId)) {
			return fail(400, { action: 'deleteBook', success: false, message: 'Invalid book id.', bookId });
		}

		const currentBook = await getBookForUser(bookId, user.id);
		const result = await deleteBook(bookId, user.id);
		if (result === 'not_found') {
			return fail(404, {
				action: 'deleteBook',
				success: false,
				message: 'Book not found.',
				bookId
			});
		}
		if (result === 'forbidden') {
			return fail(403, {
				action: 'deleteBook',
				success: false,
				message: 'Only the book owner can delete this book.',
				bookId
			});
		}

		let nextBookId: string | null = null;
		if (currentBook) {
			const remaining = await listBooksForUser(user.id);
			nextBookId = remaining[0]?.bookId ?? null;
		}

		return {
			action: 'deleteBook',
			success: true,
			deletedBookId: bookId,
			nextBookId
		};
	}
};
