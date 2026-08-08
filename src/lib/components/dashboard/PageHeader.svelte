<script lang="ts">
	import { Button } from '../ui/button/index.ts';
	import MonthYearPicker from '../ui/month-year-picker/month-year-picker.svelte';
	import * as ToggleGroup from '../ui/toggle-group/index.ts';
	import Share2 from '@lucide/svelte/icons/share-2';

	let { bookName, view, onViewChange, canShare = true } = $props();

	let activeView = $state(view);

	$effect(() => {
		if (view !== activeView) activeView = view;
	});

	function handleChange(value: string) {
		if (!value) {
			activeView = view;
			return;
		}
		activeView = value;
		onViewChange(value);
	}
</script>

<div class="flex items-center justify-between border-b border-border p-8 align-middle">
	<h1 class="flex-1 text-3xl font-bold tracking-tight">{bookName}</h1>
	<div class="flex items-center gap-4">
		<ToggleGroup.Root
			type="single"
			bind:value={activeView}
			onValueChange={handleChange}
			class="hover:pointer flex items-center gap-1 rounded-lg bg-slate-100 p-2 text-sm"
		>
			<ToggleGroup.Item
				value="month"
				aria-label="Month view"
				class="cursor-pointer rounded-md px-3 py-3 font-medium transition-colors data-[state=off]:text-slate-500 data-[state=off]:hover:text-slate-800 data-[state=on]:rounded-sm data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-sm"
			>
				Month
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="year"
				aria-label="Year view"
				class="cursor-pointer rounded-md px-3 py-1 font-medium transition-colors data-[state=off]:text-slate-500 data-[state=off]:hover:text-slate-800 data-[state=on]:rounded-sm data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-sm"
			>
				Year
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<MonthYearPicker id="dashboard-date-picker" mode={activeView} class="p-5" />
		{#if canShare}
			<Button variant="default" class="p-5">
				<Share2 />
				Share
			</Button>
		{/if}
	</div>
</div>
