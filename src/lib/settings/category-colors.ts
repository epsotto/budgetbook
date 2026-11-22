import { CATEGORY_COLOR_KEYS, type CategoryColorKey } from '@/types/Settings/category';

const COLOR_TOKENS: Record<CategoryColorKey, string> = {
	blue: 'var(--color-primary)',
	orange: 'var(--color-chart-1)',
	green: 'var(--color-tertiary)',
	yellow: 'var(--color-chart-4)',
	violet: 'var(--color-category-violet)',
	rose: 'var(--color-category-rose)',
	teal: 'var(--color-category-teal)',
	slate: 'var(--color-category-slate)'
};

export const categoryColorOptions = CATEGORY_COLOR_KEYS.map((key) => ({
	key,
	label: key.charAt(0).toUpperCase() + key.slice(1),
	value: COLOR_TOKENS[key]
}));

export function categoryColorValue(color: string): string {
	return COLOR_TOKENS[color as CategoryColorKey] ?? COLOR_TOKENS.blue;
}

/** Tonal icon tile used by category cards and the year view. */
export function categoryTileStyle(color: string): string {
	const value = categoryColorValue(color);
	return `color: ${value}; background-color: color-mix(in oklch, ${value} 12%, var(--color-surface-container-lowest))`;
}
