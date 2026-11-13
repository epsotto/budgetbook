<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import MonthView from './month-view/MonthView.svelte';
	import YearView from '@/components/dashboard/year-view/YearView.svelte';
	import PageHeader from './PageHeader.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';
	import { untrack } from 'svelte';
	import { getSampleBookData } from '@/data/sample-book-data';

	let {
		bookId,
		bookName,
		view = 'month'
	}: { bookId: string; bookName: string; view?: string } = $props();

	// The dashboard is keyed by bookId in the page, so a new instance is created on
	// every book switch. Read the prop untracked to make that one-time snapshot explicit.
	const sampleData = untrack(() => getSampleBookData(bookId));
	let headerHeight = $state(0);
	let categories = $state<Category[]>(sampleData.categories);
	let merchantList = $state<Merchant[]>(sampleData.merchantList);

	function handleTransactionAdded(merchantId: string, transaction: TransactionItem) {
		merchantList = merchantList.map((merchant) =>
			merchant.id === merchantId
				? { ...merchant, transactions: [...merchant.transactions, transaction] }
				: merchant
		);
	}

	function handleTransactionUpdated(merchantId: string, transaction: TransactionItem) {
		merchantList = merchantList.map((merchant) =>
			merchant.id === merchantId
				? {
						...merchant,
						transactions: merchant.transactions.map((existing) =>
							existing.transactionId === transaction.transactionId ? transaction : existing
						)
					}
				: merchant
		);
	}

	function handleTransactionDeleted(merchantId: string, transactionId: string) {
		merchantList = merchantList.map((merchant) =>
			merchant.id === merchantId
				? {
						...merchant,
						transactions: merchant.transactions.filter(
							(transaction) => transaction.transactionId !== transactionId
						)
					}
				: merchant
		);
	}

	const categoryColors = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)'
	];

	function handleCategoryAdded(name: string, budget: number) {
		categories = [
			...categories,
			{
				id: crypto.randomUUID(),
				name,
				icon: 'shopping-cart',
				budget,
				iconColor: categoryColors[categories.length % categoryColors.length]
			}
		];
	}

	function handleItemAdded(categoryId: string, name: string) {
		merchantList = [
			...merchantList,
			{
				id: crypto.randomUUID(),
				name,
				categoryId,
				transactions: []
			}
		];
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
		<MonthView
			{categories}
			{bookName}
			{merchantList}
			onTransactionAdded={handleTransactionAdded}
			onTransactionUpdated={handleTransactionUpdated}
			onTransactionDeleted={handleTransactionDeleted}
		/>
	{:else if view === 'year'}
		<YearView
			{categories}
			{bookName}
			{merchantList}
			onTransactionAdded={handleTransactionAdded}
			onTransactionUpdated={handleTransactionUpdated}
			onTransactionDeleted={handleTransactionDeleted}
			onAddCategory={handleCategoryAdded}
			onAddItem={handleItemAdded}
		/>
	{/if}
</div>
