export interface Category {
	id: string;
	name: string;
	icon: string;
	iconColor: string;
	budget: number;
}

/**
 * Stable palette keys for category colours. Storing the key (instead of a hex
 * value) lets the UI pick a contrast-safe foreground/background pair per theme.
 */
export const CATEGORY_COLOR_KEYS = [
	'blue',
	'orange',
	'green',
	'yellow',
	'violet',
	'rose',
	'teal',
	'slate'
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number];

export interface CategoryDraft {
	name: string;
	description: string;
	icon: string;
	color: CategoryColorKey;
	budget: number;
}

/** UI view model for the settings Category Library. Not persisted yet. */
export interface CategoryLibraryItem extends Category, CategoryDraft {
	isArchived: boolean;
}
