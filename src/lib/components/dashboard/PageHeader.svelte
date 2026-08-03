<script lang="ts">
	import * as ToggleGroup from '../ui/toggle-group/index.ts';
	let { bookName, monthLabel, view, onViewChange, canShare = true } = $props();
</script>

<div class="flex items-center justify-between border-b border-border p-8 align-middle">
	<h1 class="text-3xl font-bold tracking-tight">{bookName}</h1>
	<ToggleGroup.Root
		type="single"
		value={view}
		onValueChange={onViewChange}
		class="flex items-center space-x-2"
	>
		<ToggleGroup.Item value="month" aria-label="Month view">
			<span class="text-sm font-medium">{monthLabel}</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item value="year" aria-label="Year view">
			<span class="text-sm font-medium">Year</span>
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>
