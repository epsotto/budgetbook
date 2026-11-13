<script lang="ts">
	let {
		monthly,
		months,
		currentMonth
	}: {
		monthly: number[];
		months: string[];
		currentMonth: number;
	} = $props();

	function formatAmount(amount: number) {
		return amount === 0 ? '—' : `$${amount.toFixed(2)}`;
	}
</script>

<tr class="bg-total-row font-semibold text-total-row-foreground">
	<th scope="row" class="sticky left-0 z-10 bg-total-row px-5 py-4 text-left text-sm font-semibold">
		Total Net Worth Change
	</th>
	{#each months as month, index (month)}
		<td class="px-3 py-4 text-right text-sm {index === currentMonth ? 'bg-white/5' : ''}">
			<span class="text-amount">{formatAmount(monthly[index] ?? 0)}</span>
		</td>
	{/each}
</tr>
