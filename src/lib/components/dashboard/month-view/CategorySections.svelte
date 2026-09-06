<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import { categoryIcons, defaultIcon } from '@/icons';
	import { X } from '@lucide/svelte';
	import type { Merchant } from '@/types/Transactions/merchant';

	let {
		category,
		merchants,
		onMerchantClick
	}: { category: Category; merchants: Merchant[]; onMerchantClick: (merchant: Merchant) => void } =
		$props();
	let Icon = $derived(categoryIcons[category.icon] ?? defaultIcon);
	let isAddingNewItem = $state(false);
	let newItemName = $state('');
	let draftMerchants = $state<Merchant[]>([]);
	let merchantsUnderCategory = $derived([
		...merchants.filter((merchant) => merchant.categoryId === category.id),
		...draftMerchants
	]);
	let merchantSubTotal = $derived(
		merchantsUnderCategory.reduce((sum, merchant) => sum + merchant.subTotal, 0)
	);
	let expensePercent = $derived((merchantSubTotal / category.budget) * 100);

	function handleAddingNewItem() {
		newItemName = '';
		isAddingNewItem = true;
	}

	function handleCancelNewItem() {
		newItemName = '';
		isAddingNewItem = false;
	}

	function handleSaveNewItem() {
		const name = newItemName.trim();
		if (name) {
			draftMerchants = [
				...draftMerchants,
				{
					id: crypto.randomUUID(),
					name,
					subTotal: 0,
					numberOfTransactions: 0,
					categoryId: category.id
				}
			];
		}
		newItemName = '';
		isAddingNewItem = false;
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSaveNewItem();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			handleCancelNewItem();
		}
	}
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
					<td class="p-4 text-right">{merchant.numberOfTransactions}</td>
					<td class="p-4 text-right">${merchant.subTotal.toFixed(2)}</td>
				</tr>
			{/each}
			{#if isAddingNewItem}
				<tr class="bg-slate-50">
					<td class="p-4">
						<div class="flex items-center gap-2">
							<input
								type="text"
								placeholder="Enter item name"
								bind:value={newItemName}
								onkeydown={handleInputKeydown}
								class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
							/>
							<button
								type="button"
								class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
								title="Cancel"
								onclick={handleCancelNewItem}
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					</td>
					<td class="p-4 text-right">—</td>
					<td class="p-4 text-right">—</td>
				</tr>
			{/if}
			<tr>
				<td colspan="3" class="p-4">
					{#if !isAddingNewItem}
						<button
							class="text-md w-full cursor-pointer rounded-md border-3 border-dashed border-slate-300 p-4 text-center font-semibold text-slate-500 transition-colors hover:border-transparent hover:bg-primary hover:text-primary-foreground"
							onclick={handleAddingNewItem}
						>
							Add New Item
						</button>
					{:else}
						<button
							class="text-md w-full cursor-pointer rounded-md border-3 border-dashed border-slate-300 p-4 text-center font-semibold text-slate-500 transition-colors hover:border-transparent hover:bg-success hover:text-primary-foreground"
							onclick={handleSaveNewItem}
						>
							Save Item
						</button>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</div>
