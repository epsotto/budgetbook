<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';
	import SpreadsheetTable from './SpreadsheetTable.svelte';
	import SpreadsheetToolbar from './SpreadsheetToolbar.svelte';
	import TransactionDrawer from '@/components/dashboard/month-view/TransactionDrawer.svelte';

	let {
		categories,
		bookName,
		merchantList,
		onTransactionAdded,
		onTransactionUpdated,
		onTransactionDeleted,
		onAddCategory,
		onAddItem
	}: {
		categories: Category[];
		bookName: string;
		merchantList: Merchant[];
		onTransactionAdded: (merchantId: string, transaction: TransactionItem) => void;
		onTransactionUpdated: (merchantId: string, transaction: TransactionItem) => void;
		onTransactionDeleted: (merchantId: string, transactionId: string) => void;
		onAddCategory: (name: string, budget: number) => void;
		onAddItem: (categoryId: string, name: string) => void;
	} = $props();

	const year = new Date().getFullYear();
	const monthNames = Array.from({ length: 12 }, (_, index) =>
		new Date(Date.UTC(2024, index, 1)).toLocaleDateString('en-US', {
			month: 'short',
			timeZone: 'UTC'
		})
	);

	let transactionDrawerOpen = $state(false);
	let selectedMerchantId = $state<string | null>(null);
	let selectedMerchant = $derived(
		merchantList.find((merchant) => merchant.id === selectedMerchantId) ?? null
	);
	let selectedCategoryName = $derived(
		categories.find((category) => category.id === selectedMerchant?.categoryId)?.name ??
			'Uncategorised'
	);

	function handleSelectMerchant(merchant: Merchant) {
		selectedMerchantId = merchant.id;
		transactionDrawerOpen = true;
	}

	function transactionsForYear(merchant: Merchant) {
		return merchant.transactions.filter((transaction) => {
			const parsed = new Date(`${transaction.date}T00:00:00Z`);
			return !Number.isNaN(parsed.getTime()) && parsed.getUTCFullYear() === year;
		});
	}

	function monthlyTotals(transactions: TransactionItem[]) {
		return Array.from({ length: 12 }, (_, index) =>
			transactions.reduce((sum, transaction) => {
				const parsed = new Date(`${transaction.date}T00:00:00Z`);
				return !Number.isNaN(parsed.getTime()) && parsed.getUTCMonth() === index
					? sum + Number(transaction.amount)
					: sum;
			}, 0)
		);
	}

	function escapeCsv(value: string | number) {
		const text = String(value);
		return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
	}

	function handleExportCsv() {
		const rows: (string | number)[][] = [['Category', 'Item', ...monthNames, 'Total']];
		const yearTotals = Array.from({ length: 12 }, () => 0);

		for (const category of categories) {
			const merchants = merchantList.filter((merchant) => merchant.categoryId === category.id);
			const categoryMonthly = Array.from({ length: 12 }, () => 0);

			for (const merchant of merchants) {
				const monthly = monthlyTotals(transactionsForYear(merchant));
				const total = monthly.reduce((sum, amount) => sum + amount, 0);

				monthly.forEach((amount, index) => {
					categoryMonthly[index] += amount;
					yearTotals[index] += amount;
				});

				rows.push([
					category.name,
					merchant.name,
					...monthly.map((amount) => amount.toFixed(2)),
					total.toFixed(2)
				]);
			}

			if (merchants.length === 0) {
				rows.push([category.name, '', ...categoryMonthly.map(() => '0.00'), '0.00']);
			}
		}

		rows.push([
			'Total',
			'',
			...yearTotals.map((amount) => amount.toFixed(2)),
			yearTotals.reduce((sum, amount) => sum + amount, 0).toFixed(2)
		]);

		const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');

		anchor.href = url;
		anchor.download = `budgetbook-${year}.csv`;
		anchor.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-1 flex-col gap-6 p-8 pt-4">
	<SpreadsheetToolbar onExportCsv={handleExportCsv} {onAddCategory} />
	<SpreadsheetTable
		{categories}
		{merchantList}
		{year}
		onSelectMerchant={handleSelectMerchant}
		{onAddItem}
	/>
</div>

<TransactionDrawer
	open={transactionDrawerOpen}
	merchant={selectedMerchant}
	categoryName={selectedCategoryName}
	{bookName}
	onOpenChange={(state) => (transactionDrawerOpen = state)}
	{onTransactionAdded}
	{onTransactionUpdated}
	{onTransactionDeleted}
/>
