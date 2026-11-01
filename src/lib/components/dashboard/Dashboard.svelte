<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import MonthView from './month-view/MonthView.svelte';
	import PageHeader from './PageHeader.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let { bookName, view = 'month' } = $props();
	let headerHeight = $state(0);
	let categories: Category[] = $state([
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
	] as Category[]);

	let merchantList = $state<Merchant[]>([
		{
			id: crypto.randomUUID(),
			name: 'Costco',
			categoryId: 'groceries',
			transactions: [
				{ date: '2026-03-01', description: 'Bulk buy for the month', amount: 1250 },
				{ date: '2026-03-18', description: 'Household supplies', amount: 850 }
			]
		},
		{
			id: crypto.randomUUID(),
			name: 'Maccas',
			categoryId: 'food',
			transactions: [
				{ date: '2026-03-02', description: 'Coffee & muffin', amount: 4.5 },
				{ date: '2026-03-03', description: 'Big Mac meal', amount: 5.2 },
				{ date: '2026-03-05', description: 'Hash brown', amount: 3.8 },
				{ date: '2026-03-06', description: 'McChicken meal', amount: 4.9 },
				{ date: '2026-03-08', description: 'Family breakfast', amount: 6.1 },
				{ date: '2026-03-10', description: 'Cheeseburger', amount: 4.3 },
				{ date: '2026-03-11', description: 'Quarter Pounder meal', amount: 5.5 },
				{ date: '2026-03-13', description: 'Fries', amount: 3.95 },
				{ date: '2026-03-15', description: 'McFlurry', amount: 4.75 },
				{ date: '2026-03-17', description: 'Nuggets meal', amount: 5.25 },
				{ date: '2026-03-19', description: 'Flat white', amount: 4.6 },
				{ date: '2026-03-21', description: 'Apple pie', amount: 3.85 },
				{ date: '2026-03-23', description: 'Double cheeseburger meal', amount: 5.1 },
				{ date: '2026-03-26', description: 'Sausage roll', amount: 3.4 },
				{ date: '2026-03-29', description: 'Soft serve', amount: 2.3 }
			]
		},
		{
			id: crypto.randomUUID(),
			name: 'Dominos',
			categoryId: 'food',
			transactions: [
				{ date: '2026-03-07', description: 'Pizza night', amount: 32.5 },
				{ date: '2026-03-22', description: 'Garlic bread & sides', amount: 17.5 }
			]
		},
		{
			id: crypto.randomUUID(),
			name: 'Mercury',
			categoryId: 'utilities',
			transactions: [
				{ date: '2026-03-01', description: 'March power bill', amount: 68.35 },
				{ date: '2026-03-15', description: 'Broadband add-on', amount: 31.65 }
			]
		},
		{
			id: crypto.randomUUID(),
			name: 'Bus',
			categoryId: 'transport',
			transactions: [{ date: '2026-03-01', description: 'Monthly bus pass', amount: 200 }]
		},
		{
			id: crypto.randomUUID(),
			name: 'Petrol',
			categoryId: 'transport',
			transactions: [
				{ date: '2026-03-04', description: 'Fuel - 45L', amount: 72.5 },
				{ date: '2026-03-14', description: 'Fuel - 42L', amount: 68.3 },
				{ date: '2026-03-24', description: 'Fuel - 36L', amount: 59.2 }
			]
		},
		{
			id: crypto.randomUUID(),
			name: 'Hoyts',
			categoryId: 'entertainment',
			transactions: [{ date: '2026-03-12', description: 'Movie ticket', amount: 30 }]
		}
	]);

	function handleTransactionAdded(merchantId: string, transaction: TransactionItem) {
		merchantList = merchantList.map((merchant) =>
			merchant.id === merchantId
				? { ...merchant, transactions: [...merchant.transactions, transaction] }
				: merchant
		);
	}

	function handleViewChange(newView: string) {
		view = newView;
	}
</script>

<div style="--sticky-header-offset: {headerHeight}px">
	<div bind:clientHeight={headerHeight} class="sticky top-0 z-30 bg-background">
		<PageHeader {bookName} {view} onViewChange={handleViewChange} />
	</div>
	{#if view === 'month'}
		<MonthView {categories} {bookName} {merchantList} onTransactionAdded={handleTransactionAdded} />
	{/if}
</div>
