<script lang="ts">
	import { Check, Plus, X } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import { categoryIcons, defaultIcon } from '@/icons';
	import type { Category } from '@/types/Settings/category';

	let {
		category,
		monthly,
		months,
		currentMonth,
		onAddItem
	}: {
		category: Category;
		monthly: number[];
		months: string[];
		currentMonth: number;
		onAddItem: (categoryId: string, name: string) => void;
	} = $props();

	let Icon = $derived(categoryIcons[category.icon] ?? defaultIcon);
	let isAdding = $state(false);
	let newItemName = $state('');

	function formatAmount(amount: number) {
		return amount === 0 ? '—' : `$${amount.toFixed(2)}`;
	}

	function handleStartAdding() {
		newItemName = '';
		isAdding = true;
	}

	function handleCancel() {
		newItemName = '';
		isAdding = false;
	}

	function handleSave() {
		const name = newItemName.trim();
		if (!name) return;

		onAddItem(category.id, name);
		handleCancel();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			handleCancel();
		}
	}
</script>

<tr class="group bg-surface-container-low/70 font-semibold">
	<th
		scope="row"
		class="sticky left-0 z-10 border-b border-border bg-surface-container-low px-5 py-3 text-left"
	>
		<div class="flex items-center justify-between gap-3">
			<div class="flex min-w-0 items-center gap-3">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
					style="color: {category.iconColor}; background-color: color-mix(in oklch, {category.iconColor} 12%, white)"
				>
					<Icon class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<div class="truncate text-sm font-semibold">{category.name}</div>
					<div class="text-xs font-normal text-muted-foreground">
						Budget: ${category.budget.toFixed(2)}
					</div>
				</div>
			</div>
			<Button
				variant="ghost"
				size="icon-xs"
				class="shrink-0 text-muted-foreground hover:text-foreground"
				aria-label={`Add item to ${category.name}`}
				title={`Add item to ${category.name}`}
				onclick={handleStartAdding}
			>
				<Plus />
			</Button>
		</div>

		{#if isAdding}
			<div class="mt-2 flex items-center gap-1.5">
				<input
					type="text"
					bind:value={newItemName}
					placeholder="Item name"
					aria-label="New item name"
					onkeydown={handleKeydown}
					class="h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm font-normal outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
				/>
				<Button
					size="icon-xs"
					class="shrink-0 bg-success text-success-foreground hover:bg-success/90"
					aria-label="Save item"
					title="Save"
					disabled={!newItemName.trim()}
					onclick={handleSave}
				>
					<Check />
				</Button>
				<Button
					size="icon-xs"
					class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
					aria-label="Cancel adding item"
					title="Cancel"
					onclick={handleCancel}
				>
					<X />
				</Button>
			</div>
		{/if}
	</th>
	{#each months as month, index (month)}
		<td
			class="border-b border-border px-3 py-3 text-right text-sm {index === currentMonth
				? 'bg-primary/5 text-primary'
				: ''}"
		>
			{formatAmount(monthly[index] ?? 0)}
		</td>
	{/each}
</tr>
