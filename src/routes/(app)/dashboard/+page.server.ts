import { redirect } from '@sveltejs/kit';
import { bookActions } from '$lib/server/book-actions';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { books } = await parent();
	const firstBook = books[0];
	if (firstBook) {
		throw redirect(302, `/dashboard/${firstBook.bookId}`);
	}

	return {};
};

export const actions: Actions = bookActions;
