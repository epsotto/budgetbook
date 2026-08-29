<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import { categoryIcons, defaultIcon } from '@/icons';
	import type { Merchant } from '@/types/Transactions/merchant';

	let { category, merchants }: { category: Category; merchants: Merchant[] } = $props();
	let Icon = $derived(categoryIcons[category.icon] ?? defaultIcon);
	let merchantsUnderCategory = $derived(
		merchants.filter((merchant) => merchant.categoryId === category.id)
	);
	let merchantSubTotal = $derived(
		merchantsUnderCategory.reduce((sum, merchant) => sum + merchant.subTotal, 0)
	);
	let expensePercent = $derived((merchantSubTotal / category.budget) * 100);
</script>

<div class="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
	<div class="flex flex-row items-center gap-4">
		<Icon class="h-12 w-12" />
		<div class="col-8 flex flex-1 flex-col gap-2">
			<div class="text-lg font-semibold">{category.name}</div>
			<div class="text-sm text-slate-500">Budget: ${category.budget}</div>
		</div>
		<div class="col-2">
			{merchantSubTotal}/{category.budget}
			<div class="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
				<div class="h-full bg-orange-500" style="width: {expensePercent}%"></div>
			</div>
		</div>
	</div>
	<table class="w-full table-fixed">
		<thead>
			<tr>
				<th class="w-1/2 text-left">MERCHANT</th>
				<th class="w-1/8 text-right">TRANSACTIONS</th>
				<th class="w-1/8 text-right">SUBTOTAL</th>
			</tr>
		</thead>
		<tbody>
			{#each merchants as merchant (merchant.id)}
				<tr>
					<td>{merchant.name}</td>
					<td class="text-right">2</td>
					<td class="text-right">{merchant.subTotal}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
