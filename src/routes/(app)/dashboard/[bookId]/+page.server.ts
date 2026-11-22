import { error, redirect } from '@sveltejs/kit';
import { bookActions } from '$lib/server/book-actions';
import { getBookDashboardData, getBookForUser, isBookId } from '$lib/server/books';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (!isBookId(params.bookId)) {
		throw error(404, 'Book not found');
	}

	const book = await getBookForUser(params.bookId, locals.user.id);
	if (!book) {
		throw error(404, 'Book not found');
	}

	const dashboard = await getBookDashboardData(book.bookId);

	return {
		book,
		dashboard
	};
};

export const actions: Actions = bookActions;
