import type { BookBudgetRules } from '@/types/Settings/budget-rules';
import type { CategoryLibraryItem } from '@/types/Settings/category';

/**
 * Temporary in-memory data for the settings Category Library shell.
 * Replace with a `+page.server.ts` load once category actions are wired up.
 */
export const SAMPLE_CATEGORY_LIBRARY: Record<string, CategoryLibraryItem[]> = {
	'book-personal-2026': [
		{
			id: 'sample-housing',
			name: 'Housing',
			description: 'Mortgage, rent, utilities, and maintenance.',
			icon: 'home',
			color: 'blue',
			iconColor: 'var(--color-primary)',
			budget: 2400,
			isArchived: false
		},
		{
			id: 'sample-entertainment',
			name: 'Entertainment',
			description: 'Movies, events, and leisure activities.',
			icon: 'film',
			color: 'green',
			iconColor: 'var(--color-tertiary)',
			budget: 450,
			isArchived: false
		},
		{
			id: 'sample-dining',
			name: 'Dining & Groceries',
			description: 'Restaurants, cafes, and weekly grocery spend.',
			icon: 'utensils',
			color: 'slate',
			iconColor: 'var(--color-category-slate)',
			budget: 900,
			isArchived: false
		},
		{
			id: 'sample-holiday',
			name: 'Holiday Savings',
			description: 'Annual trip fund, paused for this year.',
			icon: 'plane',
			color: 'violet',
			iconColor: 'var(--color-category-violet)',
			budget: 200,
			isArchived: true
		}
	],
	'book-house-reno': [
		{
			id: 'sample-materials',
			name: 'Materials',
			description: 'Timber, plaster, paint, and hardware.',
			icon: 'hammer',
			color: 'orange',
			iconColor: 'var(--color-chart-1)',
			budget: 3200,
			isArchived: false
		},
		{
			id: 'sample-trades',
			name: 'Trades',
			description: 'Electrician, plumber, and carpenter invoices.',
			icon: 'wrench',
			color: 'teal',
			iconColor: 'var(--color-category-teal)',
			budget: 1800,
			isArchived: false
		}
	],
	'book-business-2026': [
		{
			id: 'sample-software',
			name: 'Software',
			description: 'Subscriptions, licences, and cloud hosting.',
			icon: 'laptop',
			color: 'blue',
			iconColor: 'var(--color-primary)',
			budget: 650,
			isArchived: false
		},
		{
			id: 'sample-travel',
			name: 'Client Travel',
			description: 'Flights and rail for on-site visits.',
			icon: 'plane',
			color: 'rose',
			iconColor: 'var(--color-category-rose)',
			budget: 1200,
			isArchived: false
		}
	]
};

export const DEFAULT_CATEGORY_LIBRARY: CategoryLibraryItem[] = [];

export const DEFAULT_BOOK_RULES: BookBudgetRules = {
	periodStartDay: 1,
	carryOverEnabled: false,
	startingBalance: '0.00'
};
