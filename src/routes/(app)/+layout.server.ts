import { redirect } from '@sveltejs/kit';

// src/routes/(dashboard)/+layout.server.ts
export const load = async (event) => {
	// Because of hooks.server.ts, event.locals.user is automatically populated
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}
	return { user: event.locals.user };
};
