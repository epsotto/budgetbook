/**
 * Shape shared between the book form actions and the sidebar that submits them.
 * Kept deliberately loose so it can accept the generated SvelteKit `ActionData`.
 */
export interface BookFormResult {
	action?: string;
	message?: string;
	name?: string;
	success?: boolean;
}
