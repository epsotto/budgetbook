<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { BookBudgetRules } from '@/types/Settings/budget-rules';

	let {
		bookName,
		rules,
		canEdit = false,
		onChange
	}: {
		bookName: string;
		rules: BookBudgetRules;
		canEdit?: boolean;
		onChange: (rules: BookBudgetRules) => void;
	} = $props();

	function update<K extends keyof BookBudgetRules>(key: K, value: BookBudgetRules[K]) {
		if (!canEdit) return;
		onChange({ ...rules, [key]: value });
	}
</script>

<section class="mt-10 rounded-xl bg-surface-container-low p-8">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h3 class="text-xl font-bold">Book budget rules</h3>
			<p class="mt-1 text-sm text-muted-foreground">
				Applied to every category in {bookName}.
			</p>
		</div>
		<span
			class="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
		>
			Owner only
		</span>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
		<label class="block">
			<span
				class="mb-2 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
			>
				Budget period starts
			</span>
			<span class="relative block">
				<select
					value={rules.periodStartDay}
					disabled={!canEdit}
					onchange={(event) =>
						update('periodStartDay', Number(event.currentTarget.value) as 1 | 15 | 25)}
					class="w-full appearance-none rounded-lg bg-surface-container-lowest py-3 pr-9 pl-3 text-sm font-semibold focus:ring-2 focus:ring-primary disabled:opacity-60"
				>
					<option value={1}>1st of the month</option>
					<option value={15}>15th of the month</option>
					<option value={25}>25th of the month</option>
				</select>
				<ChevronDown
					class="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground"
					strokeWidth={1.5}
				/>
			</span>
		</label>

		<div>
			<span
				class="mb-2 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
			>
				Carry over unused budget
			</span>
			<label
				class="flex items-center justify-between gap-4 rounded-lg bg-surface-container-lowest px-4 py-3"
			>
				<span class="text-sm font-semibold">Roll over each month</span>
				<input
					type="checkbox"
					class="peer sr-only"
					checked={rules.carryOverEnabled}
					disabled={!canEdit}
					onchange={(event) => update('carryOverEnabled', event.currentTarget.checked)}
				/>
				<span
					class="relative h-6 w-11 shrink-0 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-60 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
				></span>
			</label>
		</div>

		<label class="block">
			<span
				class="mb-2 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
			>
				Starting balance
			</span>
			<span class="relative block">
				<span
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
				>
					$
				</span>
				<input
					type="text"
					inputmode="decimal"
					value={rules.startingBalance}
					disabled={!canEdit}
					oninput={(event) => update('startingBalance', event.currentTarget.value)}
					class="w-full rounded-lg bg-surface-container-lowest py-3 pr-4 pl-7 text-sm font-semibold focus:ring-2 focus:ring-primary disabled:opacity-60"
				/>
			</span>
		</label>
	</div>

	<p class="mt-6 text-xs text-muted-foreground">
		Archived categories stay in historical exports but are hidden from month and year views.
	</p>
</section>
