<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import MonthView from './month-view/MonthView.svelte';
	import PageHeader from './PageHeader.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';

	let { bookName, view = 'month' } = $props();
	let headerHeight = $state(0);
	let categories: Category[] = $state([
		{ id: 'food', name: 'Food', icon: 'utensils', budget: 400 },
		{ id: 'entertainment', name: 'Entertainment', icon: 'film', budget: 500 },
		{ id: 'utilities', name: 'Utilities', icon: 'lightbulb', budget: 400 },
		{ id: 'transport', name: 'Transport', icon: 'bus', budget: 500 },
		{ id: 'groceries', name: 'Groceries', icon: 'shopping-cart', budget: 2000 }
	] as Category[]);

	let merchantList = [
		{
			id: crypto.randomUUID(),
			name: 'Costco',
			categoryId: 'groceries',
			subTotal: 1500,
			numberOfTransactions: 2
		},
		{
			id: crypto.randomUUID(),
			name: 'Maccas',
			categoryId: 'food',
			subTotal: 67.5,
			numberOfTransactions: 15
		},
		{
			id: crypto.randomUUID(),
			name: 'Dominos',
			categoryId: 'food',
			subTotal: 50,
			numberOfTransactions: 2
		},
		{
			id: crypto.randomUUID(),
			name: 'Mercury',
			categoryId: 'utilities',
			subTotal: 100,
			numberOfTransactions: 2
		},
		{
			id: crypto.randomUUID(),
			name: 'Bus',
			categoryId: 'transport',
			subTotal: 200,
			numberOfTransactions: 1
		},
		{
			id: crypto.randomUUID(),
			name: 'Petrol',
			categoryId: 'transport',
			subTotal: 200,
			numberOfTransactions: 3
		},
		{
			id: crypto.randomUUID(),
			name: 'Hoyts',
			categoryId: 'entertainment',
			subTotal: 30,
			numberOfTransactions: 1
		}
	] as Merchant[];

	function handleViewChange(newView: string) {
		view = newView;
	}
</script>

<div style="--sticky-header-offset: {headerHeight}px">
	<div bind:clientHeight={headerHeight} class="sticky top-0 z-30 bg-background">
		<PageHeader {bookName} {view} onViewChange={handleViewChange} />
	</div>
	<MonthView {categories} {bookName} {merchantList} />
</div>
