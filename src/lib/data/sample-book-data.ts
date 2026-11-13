import type { Category } from '@/types/Settings/category';
import type { Merchant } from '@/types/Transactions/merchant';

export interface BookSampleData {
	categories: Category[];
	merchantList: Merchant[];
}

const personal2026: BookSampleData = {
	categories: [
		{ id: 'food', name: 'Food', icon: 'utensils', budget: 400, iconColor: 'var(--chart-1)' },
		{
			id: 'entertainment',
			name: 'Entertainment',
			icon: 'film',
			budget: 500,
			iconColor: 'var(--chart-2)'
		},
		{
			id: 'utilities',
			name: 'Utilities',
			icon: 'lightbulb',
			budget: 400,
			iconColor: 'var(--chart-3)'
		},
		{
			id: 'transport',
			name: 'Transport',
			icon: 'bus',
			budget: 500,
			iconColor: 'var(--chart-4)'
		},
		{
			id: 'groceries',
			name: 'Groceries',
			icon: 'shopping-cart',
			budget: 2000,
			iconColor: 'var(--chart-5)'
		}
	],
	merchantList: [
		{
			id: 'personal-costco',
			name: 'Costco',
			categoryId: 'groceries',
			transactions: [
				{
					transactionId: 'personal-costco-1',
					date: '2026-03-01',
					description: 'Bulk buy for the month',
					amount: 1250
				},
				{
					transactionId: 'personal-costco-2',
					date: '2026-03-18',
					description: 'Household supplies',
					amount: 850
				}
			]
		},
		{
			id: 'personal-maccas',
			name: 'Maccas',
			categoryId: 'food',
			transactions: [
				{
					transactionId: 'personal-maccas-1',
					date: '2026-03-02',
					description: 'Coffee & muffin',
					amount: 4.5
				},
				{
					transactionId: 'personal-maccas-2',
					date: '2026-03-03',
					description: 'Big Mac meal',
					amount: 5.2
				},
				{
					transactionId: 'personal-maccas-3',
					date: '2026-03-05',
					description: 'Hash brown',
					amount: 3.8
				},
				{
					transactionId: 'personal-maccas-4',
					date: '2026-03-06',
					description: 'McChicken meal',
					amount: 4.9
				},
				{
					transactionId: 'personal-maccas-5',
					date: '2026-03-08',
					description: 'Family breakfast',
					amount: 6.1
				},
				{
					transactionId: 'personal-maccas-6',
					date: '2026-03-10',
					description: 'Cheeseburger',
					amount: 4.3
				},
				{
					transactionId: 'personal-maccas-7',
					date: '2026-03-11',
					description: 'Quarter Pounder meal',
					amount: 5.5
				},
				{
					transactionId: 'personal-maccas-8',
					date: '2026-03-13',
					description: 'Fries',
					amount: 3.95
				},
				{
					transactionId: 'personal-maccas-9',
					date: '2026-03-15',
					description: 'McFlurry',
					amount: 4.75
				},
				{
					transactionId: 'personal-maccas-10',
					date: '2026-03-17',
					description: 'Nuggets meal',
					amount: 5.25
				},
				{
					transactionId: 'personal-maccas-11',
					date: '2026-03-19',
					description: 'Flat white',
					amount: 4.6
				},
				{
					transactionId: 'personal-maccas-12',
					date: '2026-03-21',
					description: 'Apple pie',
					amount: 3.85
				},
				{
					transactionId: 'personal-maccas-13',
					date: '2026-03-23',
					description: 'Double cheeseburger meal',
					amount: 5.1
				},
				{
					transactionId: 'personal-maccas-14',
					date: '2026-03-26',
					description: 'Sausage roll',
					amount: 3.4
				},
				{
					transactionId: 'personal-maccas-15',
					date: '2026-03-29',
					description: 'Soft serve',
					amount: 2.3
				}
			]
		},
		{
			id: 'personal-dominos',
			name: 'Dominos',
			categoryId: 'food',
			transactions: [
				{
					transactionId: 'personal-dominos-1',
					date: '2026-03-07',
					description: 'Pizza night',
					amount: 32.5
				},
				{
					transactionId: 'personal-dominos-2',
					date: '2026-03-22',
					description: 'Garlic bread & sides',
					amount: 17.5
				}
			]
		},
		{
			id: 'personal-mercury',
			name: 'Mercury',
			categoryId: 'utilities',
			transactions: [
				{
					transactionId: 'personal-mercury-1',
					date: '2026-03-01',
					description: 'March power bill',
					amount: 68.35
				},
				{
					transactionId: 'personal-mercury-2',
					date: '2026-03-15',
					description: 'Broadband add-on',
					amount: 31.65
				}
			]
		},
		{
			id: 'personal-bus',
			name: 'Bus',
			categoryId: 'transport',
			transactions: [
				{
					transactionId: 'personal-bus-1',
					date: '2026-03-01',
					description: 'Monthly bus pass',
					amount: 200
				}
			]
		},
		{
			id: 'personal-petrol',
			name: 'Petrol',
			categoryId: 'transport',
			transactions: [
				{
					transactionId: 'personal-petrol-1',
					date: '2026-03-04',
					description: 'Fuel - 45L',
					amount: 72.5
				},
				{
					transactionId: 'personal-petrol-2',
					date: '2026-03-14',
					description: 'Fuel - 42L',
					amount: 68.3
				},
				{
					transactionId: 'personal-petrol-3',
					date: '2026-03-24',
					description: 'Fuel - 36L',
					amount: 59.2
				}
			]
		},
		{
			id: 'personal-hoyts',
			name: 'Hoyts',
			categoryId: 'entertainment',
			transactions: [
				{
					transactionId: 'personal-hoyts-1',
					date: '2026-03-12',
					description: 'Movie ticket',
					amount: 30
				}
			]
		}
	]
};

const houseReno: BookSampleData = {
	categories: [
		{
			id: 'reno-materials',
			name: 'Materials',
			icon: 'hammer',
			budget: 6000,
			iconColor: 'var(--chart-1)'
		},
		{
			id: 'reno-contractors',
			name: 'Contractors',
			icon: 'hard-hat',
			budget: 12000,
			iconColor: 'var(--chart-2)'
		},
		{
			id: 'reno-fixtures',
			name: 'Fixtures & Fittings',
			icon: 'shower-head',
			budget: 3500,
			iconColor: 'var(--chart-3)'
		},
		{
			id: 'reno-furnishings',
			name: 'Furnishings',
			icon: 'sofa',
			budget: 4000,
			iconColor: 'var(--chart-4)'
		},
		{
			id: 'reno-tools',
			name: 'Tools & Equipment',
			icon: 'wrench',
			budget: 1200,
			iconColor: 'var(--chart-5)'
		}
	],
	merchantList: [
		{
			id: 'reno-bunnings',
			name: 'Bunnings',
			categoryId: 'reno-materials',
			transactions: [
				{
					transactionId: 'reno-bunnings-1',
					date: '2026-03-03',
					description: 'Timber and fixings',
					amount: 480.5
				},
				{
					transactionId: 'reno-bunnings-2',
					date: '2026-03-16',
					description: 'Paint and primer',
					amount: 312.4
				}
			]
		},
		{
			id: 'reno-tile-depot',
			name: 'Tile Depot',
			categoryId: 'reno-materials',
			transactions: [
				{
					transactionId: 'reno-tile-depot-1',
					date: '2026-03-08',
					description: 'Bathroom tiles',
					amount: 1240
				}
			]
		},
		{
			id: 'reno-buildright',
			name: 'BuildRight Constructions',
			categoryId: 'reno-contractors',
			transactions: [
				{
					transactionId: 'reno-buildright-1',
					date: '2026-03-05',
					description: 'Kitchen demolition',
					amount: 2800
				},
				{
					transactionId: 'reno-buildright-2',
					date: '2026-03-20',
					description: 'Framing progress payment',
					amount: 4500
				}
			]
		},
		{
			id: 'reno-sparky-co',
			name: 'Sparky Co',
			categoryId: 'reno-contractors',
			transactions: [
				{
					transactionId: 'reno-sparky-co-1',
					date: '2026-03-11',
					description: 'Electrical rough-in',
					amount: 1850
				}
			]
		},
		{
			id: 'reno-reece',
			name: 'Reece Plumbing',
			categoryId: 'reno-fixtures',
			transactions: [
				{
					transactionId: 'reno-reece-1',
					date: '2026-03-14',
					description: 'Shower and tapware',
					amount: 980.75
				}
			]
		},
		{
			id: 'reno-ikea',
			name: 'IKEA',
			categoryId: 'reno-furnishings',
			transactions: [
				{
					transactionId: 'reno-ikea-1',
					date: '2026-03-22',
					description: 'Kitchen cabinetry',
					amount: 2150
				}
			]
		},
		{
			id: 'reno-makita',
			name: 'Makita',
			categoryId: 'reno-tools',
			transactions: [
				{
					transactionId: 'reno-makita-1',
					date: '2026-03-02',
					description: 'Cordless drill kit',
					amount: 349
				}
			]
		}
	]
};

const business2026: BookSampleData = {
	categories: [
		{
			id: 'business-software',
			name: 'Software',
			icon: 'laptop',
			budget: 850,
			iconColor: 'var(--chart-1)'
		},
		{
			id: 'business-travel',
			name: 'Travel',
			icon: 'plane',
			budget: 3000,
			iconColor: 'var(--chart-2)'
		},
		{
			id: 'business-hardware',
			name: 'Hardware',
			icon: 'server',
			budget: 1200,
			iconColor: 'var(--chart-3)'
		},
		{
			id: 'business-marketing',
			name: 'Marketing',
			icon: 'briefcase',
			budget: 2000,
			iconColor: 'var(--chart-4)'
		},
		{
			id: 'business-meals',
			name: 'Client Meals',
			icon: 'utensils',
			budget: 600,
			iconColor: 'var(--chart-5)'
		}
	],
	merchantList: [
		{
			id: 'business-aws',
			name: 'AWS',
			categoryId: 'business-software',
			transactions: [
				{
					transactionId: 'business-aws-1',
					date: '2026-03-01',
					description: 'Cloud hosting',
					amount: 420.35
				},
				{
					transactionId: 'business-aws-2',
					date: '2026-03-15',
					description: 'Storage add-on',
					amount: 88.2
				}
			]
		},
		{
			id: 'business-google-workspace',
			name: 'Google Workspace',
			categoryId: 'business-software',
			transactions: [
				{
					transactionId: 'business-google-workspace-1',
					date: '2026-03-02',
					description: 'Team plan',
					amount: 144
				}
			]
		},
		{
			id: 'business-qantas',
			name: 'Qantas',
			categoryId: 'business-travel',
			transactions: [
				{
					transactionId: 'business-qantas-1',
					date: '2026-03-06',
					description: 'Client visit flights',
					amount: 680
				}
			]
		},
		{
			id: 'business-marriott',
			name: 'Marriott',
			categoryId: 'business-travel',
			transactions: [
				{
					transactionId: 'business-marriott-1',
					date: '2026-03-07',
					description: 'Accommodation - 2 nights',
					amount: 540
				}
			]
		},
		{
			id: 'business-apple-store',
			name: 'Apple Store',
			categoryId: 'business-hardware',
			transactions: [
				{
					transactionId: 'business-apple-store-1',
					date: '2026-03-10',
					description: 'Replacement laptop',
					amount: 1899
				}
			]
		},
		{
			id: 'business-meta-ads',
			name: 'Meta Ads',
			categoryId: 'business-marketing',
			transactions: [
				{
					transactionId: 'business-meta-ads-1',
					date: '2026-03-12',
					description: 'Campaign spend',
					amount: 750
				}
			]
		},
		{
			id: 'business-coffee-club',
			name: 'The Coffee Club',
			categoryId: 'business-meals',
			transactions: [
				{
					transactionId: 'business-coffee-club-1',
					date: '2026-03-13',
					description: 'Client breakfast',
					amount: 56.5
				}
			]
		},
		{
			id: 'business-aria',
			name: 'Aria',
			categoryId: 'business-meals',
			transactions: [
				{
					transactionId: 'business-aria-1',
					date: '2026-03-25',
					description: 'Client dinner',
					amount: 210
				}
			]
		}
	]
};

const SAMPLE_BOOK_DATA: Record<string, BookSampleData> = {
	'book-personal-2026': personal2026,
	'book-house-reno': houseReno,
	'book-business-2026': business2026
};

const FALLBACK_BOOK_ID = 'book-personal-2026';

/**
 * Returns a fresh copy of the sample dashboard data for a book so each
 * dashboard instance can edit its own transactions without leaking state.
 */
export function getSampleBookData(bookId: string): BookSampleData {
	return structuredClone(SAMPLE_BOOK_DATA[bookId] ?? SAMPLE_BOOK_DATA[FALLBACK_BOOK_ID]);
}
