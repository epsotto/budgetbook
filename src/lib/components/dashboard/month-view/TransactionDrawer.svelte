<script lang="ts">
	import { X } from '@lucide/svelte';
	import * as Drawer from '@/components/ui/drawer';
	import { Button } from '@/components/ui/button';
	import type { Merchant } from '@/types/Transactions/merchant';

	let {
		open = false,
		merchant,
		categoryName,
		bookName,
		onOpenChange
	}: {
		open: boolean;
		merchant: Merchant | null;
		categoryName: string;
		bookName: string;
		onOpenChange?: (open: boolean) => void;
	} = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	let title = $derived(merchant ? `${merchant.name} Transactions` : 'Transactions');
	let transactions = $derived(merchant?.transactions ?? []);
	let total = $derived(
		transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
	);

	function formatAmount(amount: number) {
		return `$${Number(amount).toFixed(2)}`;
	}

	function formatDate(date: string) {
		const parsed = new Date(`${date}T00:00:00Z`);
		return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
	}
</script>

<Drawer.Root {open} direction="right" {onOpenChange}>
	<Drawer.Content class="data-[vaul-drawer-direction=right]:rounded-l-none">
		<Drawer.Header class="flex flex-row items-start justify-between p-6">
			<div class="flex flex-col gap-0.5 text-left">
				<Drawer.Title class="text-xl font-semibold">{title}</Drawer.Title>
				<Drawer.Description>
					{bookName} &#9679; {categoryName}
				</Drawer.Description>
			</div>
			<Drawer.Close class="rounded-none p-1 text-muted-foreground hover:text-foreground">
				<X class="h-5 w-5" />
			</Drawer.Close>
		</Drawer.Header>

		<div class="flex w-full flex-1 flex-col overflow-y-auto bg-background">
			{#if transactions.length > 0}
				<div
					class="grid grid-cols-[6.5rem_1fr_auto] gap-3 px-6 pt-4 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
				>
					<span>Date</span>
					<span>Description</span>
					<span class="text-right">Amount</span>
				</div>
				<div class="flex flex-col gap-1 px-6 pb-6">
					{#each transactions as transaction}
						<div class="grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-3 py-3">
							<span class="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
							<span class="text-body-lg">{transaction.description}</span>
							<span class="text-body-lg text-primary">{formatAmount(transaction.amount)}</span>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-1 items-center justify-center p-6">
					<span class="text-center text-muted-foreground">No transactions found.</span>
				</div>
			{/if}
		</div>

		{#if merchant}
			<div class="flex flex-row items-baseline justify-between gap-4 bg-muted/60 px-6 py-4">
				<span class="text-muted-foreground">Total for {merchant.name}</span>
				<span class="text-xl font-semibold">{formatAmount(total)}</span>
			</div>
		{/if}

		<Drawer.Footer class="mt-0 bg-muted/30 p-6">
			<Button
				variant="default"
				class="h-10 w-full"
				onclick={() => console.log('Add Transaction clicked')}
			>
				Add Transaction
			</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
