<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import { categoryIcons, defaultIcon } from '@/icons';
	import type { Merchant } from '@/types/Transactions/merchant';

	let {
		category,
		merchants,
		onMerchantClick
	}: { category: Category; merchants: Merchant[]; onMerchantClick: (merchant: Merchant) => void } =
		$props();
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
		<div
			style="color: {category.iconColor}; background-color: color-mix(in oklch, {category.iconColor} 12%, white)"
			class="col-2 flex h-12 w-12 items-center justify-center rounded-sm"
		>
			<Icon class="h-8 w-8" />
		</div>
		<div class="col-8 flex flex-1 flex-col gap-2">
			<div class="text-lg font-semibold">{category.name}</div>
			<div class="text-sm text-slate-500">Budget: ${category.budget}</div>
		</div>
		<div class="col-2">
			<span
				class="text-3xl font-semibold {expensePercent >= 100 ? 'text-red-500' : 'text-slate-600'}"
				>${merchantSubTotal}</span
			><span class="text-lg">/${category.budget}</span>
			<div class="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
				<div
					class="h-full {expensePercent > 75 && expensePercent < 100
						? 'bg-orange-500'
						: expensePercent >= 100
							? 'bg-red-500'
							: 'bg-green-500'}"
					style="width: {expensePercent}%;"
				></div>
			</div>
		</div>
	</div>
	<table class="w-full table-fixed border-spacing-8">
		<thead>
			<tr
				class="border-b border-slate-400 text-sm font-semibold tracking-wider text-slate-400 uppercase"
			>
				<th class="w-1/2 p-4 text-left">MERCHANT</th>
				<th class="w-1/8 p-4 text-right">TRANSACTIONS</th>
				<th class="w-1/8 p-4 text-right">SUBTOTAL</th>
			</tr>
		</thead>
		<tbody>
			{#each merchantsUnderCategory as merchant (merchant.id)}
				<tr
					class="cursor-pointer transition-colors hover:bg-slate-100"
					onclick={() => onMerchantClick(merchant)}
				>
					<td class="p-4">{merchant.name}</td>
					<td class="p-4 text-right">2</td>
					<td class="p-4 text-right">{merchant.subTotal}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
