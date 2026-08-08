<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';
	import Button from '../button/button.svelte';
	import * as Popover from '../popover/index.ts';
	import { cn } from '$lib/utils.js';

	let {
		id,
		mode = 'month',
		value = $bindable(),
		locale = 'en-NZ',
		class: className,
		onValueChange
	}: {
		id: string;
		mode?: 'month' | 'year';
		value?: CalendarDate | undefined;
		locale?: string;
		class?: string;
		onValueChange?: (value: CalendarDate) => void;
	} = $props();

	let open = $state(false);
	let pickYear = $state(false);

	const initialToday = today(getLocalTimeZone());
	const todayDate = $derived(today(getLocalTimeZone()));
	const minYear = $derived(todayDate.year - 100);
	const selected = $derived(value ?? todayDate);

	let viewYear = $state(initialToday.year);
	let yearPageStart = $state(Math.min(initialToday.year - 11, (value ?? initialToday).year - 5));

	$effect(() => {
		if (open) {
			viewYear = selected.year;
			yearPageStart = Math.min(todayDate.year - 11, selected.year - 5);
			pickYear = false;
		}
	});

	const monthNames = $derived(
		Array.from({ length: 12 }, (_, i) =>
			new Date(2024, i, 1).toLocaleDateString(locale, { month: 'short' })
		)
	);

	const pageYears = $derived(Array.from({ length: 12 }, (_, i) => yearPageStart + i));

	const yearOptions = $derived(
		Array.from({ length: todayDate.year - minYear + 1 }, (_, i) => todayDate.year - i)
	);

	const displayLabel = $derived(
		selected.toDate(getLocalTimeZone()).toLocaleDateString(locale, {
			month: mode === 'month' ? 'long' : undefined,
			year: 'numeric'
		})
	);

	function selectMonth(month: number) {
		const next = selected.set({ year: viewYear, month, day: 1 });
		value = next;
		onValueChange?.(next);
	}

	function selectYear(year: number) {
		const next = selected.set({ year });
		value = next;
		onValueChange?.(next);
	}

	function goToToday() {
		value = todayDate;
		viewYear = todayDate.year;
		pickYear = false;
		onValueChange?.(todayDate);
	}

	function monthButtonClass(month: number) {
		const isSelected = viewYear === selected.year && month === selected.month;
		const isDisabled = viewYear === todayDate.year && month > todayDate.month;
		return cn(
			'rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50',
			isDisabled && 'cursor-not-allowed opacity-40',
			!isDisabled && !isSelected && 'hover:bg-muted',
			isSelected ? 'bg-primary text-primary-foreground' : 'text-foreground'
		);
	}

	function yearButtonClass(year: number) {
		const isSelected = year === selected.year;
		const isDisabled = year > todayDate.year;
		return cn(
			'rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50',
			isDisabled && 'cursor-not-allowed opacity-40',
			!isDisabled && !isSelected && 'hover:bg-muted',
			isSelected ? 'bg-primary text-primary-foreground' : 'text-foreground'
		);
	}

	function yearOptionClass(year: number) {
		return cn(
			'w-full rounded-md px-3 py-1 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50',
			year === viewYear ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
		);
	}
</script>

<div class="flex items-center gap-2">
	<label><CalendarIcon /></label>
	{#snippet selectToday()}
		<div class="flex justify-center border-t border-border pt-1">
			<Button variant="link" class="h-auto px-2 py-0 text-xs" onclick={goToToday}>Today</Button>
		</div>
	{/snippet}

	<Popover.Root bind:open>
		<Popover.Trigger id={`${id}-date`}>
			{#snippet child({ props })}
				<Button {...props} variant="outline" class={cn('min-w-40 font-medium', className)}>
					{displayLabel}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-2" align="start">
			{#if mode === 'month'}
				<div class="w-56 space-y-1.5">
					<div class="flex justify-center">
						<Button
							variant="ghost"
							class="gap-1"
							aria-expanded={pickYear}
							aria-haspopup="listbox"
							onclick={() => (pickYear = !pickYear)}
						>
							{viewYear}
							<ChevronDown />
						</Button>
					</div>
					{#if pickYear}
						<ul
							class="max-h-48 space-y-0.5 overflow-y-auto px-1"
							role="listbox"
							aria-label="Select year"
						>
							{#each yearOptions as year (year)}
								<li>
									<button
										type="button"
										role="option"
										class={yearOptionClass(year)}
										aria-selected={year === viewYear}
										onclick={() => {
											viewYear = year;
											pickYear = false;
										}}
									>
										{year}
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<div class="grid grid-cols-3 gap-1">
							{#each monthNames as name, i (i)}
								<button
									type="button"
									class={monthButtonClass(i + 1)}
									aria-pressed={viewYear === selected.year && i + 1 === selected.month}
									disabled={viewYear === todayDate.year && i + 1 > todayDate.month}
									onclick={() => selectMonth(i + 1)}
								>
									{name}
								</button>
							{/each}
						</div>
					{/if}
					{@render selectToday()}
				</div>
			{:else}
				<div class="w-56 space-y-1.5">
					<div class="flex items-center justify-between">
						<Button
							size="icon-sm"
							variant="ghost"
							aria-label="Previous years"
							disabled={yearPageStart <= minYear}
							onclick={() => (yearPageStart -= 12)}
						>
							<ChevronLeft />
						</Button>
						<span class="text-sm font-semibold">{yearPageStart}–{yearPageStart + 11}</span>
						<Button
							size="icon-sm"
							variant="ghost"
							aria-label="Next years"
							disabled={yearPageStart + 12 > todayDate.year}
							onclick={() => (yearPageStart += 12)}
						>
							<ChevronRight />
						</Button>
					</div>
					<div class="grid grid-cols-3 gap-1">
						{#each pageYears as year (year)}
							<button
								type="button"
								class={yearButtonClass(year)}
								aria-pressed={year === selected.year}
								disabled={year > todayDate.year}
								onclick={() => selectYear(year)}
							>
								{year}
							</button>
						{/each}
					</div>
					{@render selectToday()}
				</div>
			{/if}
		</Popover.Content>
	</Popover.Root>
</div>
