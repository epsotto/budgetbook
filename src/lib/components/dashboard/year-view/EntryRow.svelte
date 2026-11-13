<script lang="ts">
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let {
		transaction,
		months,
		currentMonth
	}: {
		transaction: TransactionItem;
		months: string[];
		currentMonth: number;
	} = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	let monthIndex = $derived.by(() => {
		const parsed = new Date(`${transaction.date}T00:00:00Z`);
		return Number.isNaN(parsed.getTime()) ? -1 : parsed.getUTCMonth();
	});
	let formattedDate = $derived.by(() => {
		const parsed = new Date(`${transaction.date}T00:00:00Z`);
		return Number.isNaN(parsed.getTime()) ? transaction.date : dateFormatter.format(parsed);
	});
</script>

<tr class="text-xs text-muted-foreground">
	<th
		scope="row"
		class="sticky left-0 z-10 border-b border-border bg-surface-container-lowest py-2 pr-5 pl-16 text-left font-normal"
	>
		<span class="flex items-center gap-2">
			<span class="size-1.5 shrink-0 rounded-full bg-muted-foreground/40"></span>
			<span class="truncate">{formattedDate} · {transaction.description}</span>
		</span>
	</th>
	{#each months as month, index (month)}
		<td
			class="border-b border-border px-3 py-2 text-right {index === currentMonth
				? 'bg-primary/5'
				: ''}"
		>
			{index === monthIndex ? `$${Number(transaction.amount).toFixed(2)}` : ''}
		</td>
	{/each}
</tr>
