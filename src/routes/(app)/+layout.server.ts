import { redirect } from '@sveltejs/kit';
import { listBooksForUser } from '$lib/server/books';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const books = await listBooksForUser(event.locals.user.id);

	return {
		user: event.locals.user,
		books
	};
};
