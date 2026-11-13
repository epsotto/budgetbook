<script lang="ts">
	import CategoryRow from './CategoryRow.svelte';
	import ColumnHeaders from './ColumnHeaders.svelte';
	import ItemRow from './ItemRow.svelte';
	import TotalRow from './TotalRow.svelte';
	import type { Category } from '@/types/Settings/category';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let {
		categories,
		merchantList,
		year,
		onSelectMerchant,
		onAddItem
	}: {
		categories: Category[];
		merchantList: Merchant[];
		year: number;
		onSelectMerchant: (merchant: Merchant) => void;
		onAddItem: (categoryId: string, name: string) => void;
	} = $props();

	const monthNames = Array.from({ length: 12 }, (_, index) =>
		new Date(Date.UTC(2024, index, 1)).toLocaleDateString('en-US', {
			month: 'short',
			timeZone: 'UTC'
		})
	);

	let currentMonth = $derived(year === new Date().getFullYear() ? new Date().getMonth() : -1);

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

	let rows = $derived.by(() =>
		categories.map((category) => {
			const merchants = merchantList
				.filter((merchant) => merchant.categoryId === category.id)
				.map((merchant) => {
					const transactions = merchant.transactions.filter((transaction) => {
						const parsed = new Date(`${transaction.date}T00:00:00Z`);
						return !Number.isNaN(parsed.getTime()) && parsed.getUTCFullYear() === year;
					});

					return { merchant, monthly: monthlyTotals(transactions) };
				});

			const monthly = Array.from({ length: 12 }, (_, index) =>
				merchants.reduce((sum, item) => sum + item.monthly[index], 0)
			);

			return { category, merchants, monthly };
		})
	);

	let monthlyTotalsForYear = $derived.by(() =>
		Array.from({ length: 12 }, (_, index) => rows.reduce((sum, row) => sum + row.monthly[index], 0))
	);
</script>

<div
	class="custom-scrollbar overflow-x-auto rounded-xl bg-surface-container-lowest shadow-atmospheric-sm"
>
	<table class="w-full min-w-[1180px] border-collapse text-sm">
		<colgroup>
			<col class="w-64" />
			{#each monthNames as month (month)}
				<col class="w-24" />
			{/each}
		</colgroup>
		<thead>
			<ColumnHeaders months={monthNames} {currentMonth} />
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td colspan={monthNames.length + 1} class="px-5 py-12 text-center text-muted-foreground">
						No categories yet. Add a category to start tracking your yearly budget.
					</td>
				</tr>
			{/if}
			{#each rows as row (row.category.id)}
				<CategoryRow
					category={row.category}
					monthly={row.monthly}
					months={monthNames}
					{currentMonth}
					{onAddItem}
				/>
				{#each row.merchants as item (item.merchant.id)}
					<ItemRow
						merchant={item.merchant}
						monthly={item.monthly}
						months={monthNames}
						{currentMonth}
						{year}
						onSelect={onSelectMerchant}
					/>
				{/each}
			{/each}
		</tbody>
		<tfoot>
			<TotalRow monthly={monthlyTotalsForYear} months={monthNames} {currentMonth} />
		</tfoot>
	</table>
</div>
