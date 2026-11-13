<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import EntryRow from './EntryRow.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';

	let {
		merchant,
		monthly,
		months,
		currentMonth,
		year,
		onSelect
	}: {
		merchant: Merchant;
		monthly: number[];
		months: string[];
		currentMonth: number;
		year: number;
		onSelect: (merchant: Merchant) => void;
	} = $props();

	let expanded = $state(false);

	let entries = $derived(
		merchant.transactions
			.filter((transaction) => {
				const parsed = new Date(`${transaction.date}T00:00:00Z`);
				return !Number.isNaN(parsed.getTime()) && parsed.getUTCFullYear() === year;
			})
			.sort((a, b) => a.date.localeCompare(b.date))
	);

	function formatAmount(amount: number) {
		return amount === 0 ? '—' : `$${amount.toFixed(2)}`;
	}
</script>

<tr class="group transition-colors hover:bg-surface-container-low/60">
	<th
		scope="row"
		class="sticky left-0 z-10 border-b border-border bg-surface-container-lowest px-5 py-2.5 text-left font-normal group-hover:bg-surface-container-low/60"
	>
		<div class="flex items-center gap-1 pl-6">
			{#if entries.length > 0}
				<button
					type="button"
					class="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground"
					aria-label={expanded
						? `Collapse ${merchant.name} entries`
						: `Expand ${merchant.name} entries`}
					aria-expanded={expanded}
					onclick={() => (expanded = !expanded)}
				>
					<ChevronRight class="h-3.5 w-3.5 transition-transform {expanded ? 'rotate-90' : ''}" />
				</button>
			{:else}
				<span class="size-6 shrink-0"></span>
			{/if}
			<button
				type="button"
				class="min-w-0 flex-1 cursor-pointer truncate text-left text-sm text-foreground hover:text-primary"
				onclick={() => onSelect(merchant)}
			>
				{merchant.name}
			</button>
			<span class="shrink-0 text-xs text-muted-foreground">
				{entries.length}
				{entries.length === 1 ? 'entry' : 'entries'}
			</span>
		</div>
	</th>
	{#each months as month, index (month)}
		<td
			class="border-b border-border px-3 py-2.5 text-right text-sm {index === currentMonth
				? 'bg-primary/5'
				: ''}"
		>
			{formatAmount(monthly[index] ?? 0)}
		</td>
	{/each}
</tr>

{#if expanded}
	{#each entries as transaction (transaction.transactionId)}
		<EntryRow {transaction} {months} {currentMonth} />
	{/each}
{/if}
