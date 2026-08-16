<script lang="ts">
	import { X } from '@lucide/svelte';
	import * as Drawer from '../ui/drawer/index.ts';
	import type { TransactionItem } from '../../types/Transactions/transaction-item.ts';

	let {
		title,
		open = true,
		bookName,
		category,
		items
	}: {
		title: string;
		open: boolean;
		bookName: string;
		category: string;
		items: TransactionItem[];
	} = $props();
</script>

<Drawer.Root {open} direction="right">
	<Drawer.Content class="data-[vaul-drawer-direction=right]:rounded-l-none">
		<Drawer.Header class="flex flex-row items-start justify-between">
			<div class="flex flex-col gap-0.5 text-left">
				<Drawer.Title>{title}</Drawer.Title>
				<Drawer.Description>
					{bookName} &#9679; {category}
				</Drawer.Description>
			</div>
			<Drawer.Close class="rounded-none p-1 text-muted-foreground hover:text-foreground">
				<X class="h-5 w-5" />
			</Drawer.Close>
		</Drawer.Header>
		<hr />

		<div
			class:items-center={items.length === 0}
			class:justify-center={items.length === 0}
			class="flex w-full flex-1 overflow-y-auto"
		>
			{#if items.length > 0}
				{#each items as item}
					<div class="flex w-full flex-col">
						<div class="mt-4 flex flex-row gap-8 px-4 text-body-lg">
							<div class="flex-1">{item.description}</div>
							<div>${item.amount.toFixed(2)}</div>
						</div>
						<div class="px-4 text-sm text-muted-foreground">{item.date}</div>
					</div>
				{/each}
			{:else}
				<span class="col-span-4 text-center text-slate-500">No transactions found.</span>
			{/if}
		</div>

		<Drawer.Footer class="border-t border-slate-100 bg-slate-50/50 p-8">
			<button
				class="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
				>Add Transaction</button
			>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
