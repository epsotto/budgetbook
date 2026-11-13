<script lang="ts">
	let {
		months,
		currentMonth
	}: {
		months: string[];
		currentMonth: number;
	} = $props();
</script>

<tr
	class="bg-surface-container-low text-xs font-semibold tracking-wide text-muted-foreground uppercase"
>
	<th
		scope="col"
		class="sticky left-0 z-20 w-64 min-w-64 border-b border-border bg-surface-container-low px-5 py-4 text-left"
	>
		Category / Item
	</th>
	{#each months as month, index (month)}
		<th
			scope="col"
			class="w-24 min-w-24 border-b border-border px-3 py-4 text-right {index === currentMonth
				? 'bg-primary/5 font-bold text-primary'
				: ''}"
		>
			{month}
		</th>
	{/each}
</tr>
