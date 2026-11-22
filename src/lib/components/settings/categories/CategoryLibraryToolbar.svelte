<script lang="ts">
	import { ChevronDown, Search } from '@lucide/svelte';
	import type { BudgetBook } from '@/types/Books/budget-book';

	let {
		books,
		selectedBookId = $bindable(),
		search = $bindable(''),
		showArchived = $bindable(false),
		activeCount
	}: {
		books: BudgetBook[];
		selectedBookId: string;
		search: string;
		showArchived: boolean;
		activeCount: number;
	} = $props();
</script>

<div
	class="mt-8 flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-atmospheric-sm md:flex-row md:items-center md:justify-between"
>
	<div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
		<label class="block sm:w-56">
			<span
				class="mb-1 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
			>
				Budget book
			</span>
			<span class="relative block">
				<select
					bind:value={selectedBookId}
					disabled={books.length === 0}
					class="w-full appearance-none rounded-lg bg-surface-container-low py-2.5 pr-9 pl-3 text-sm font-semibold focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary disabled:opacity-60"
				>
					{#if books.length === 0}
						<option value="">No books available</option>
					{/if}
					{#each books as book (book.bookId)}
						<option value={book.bookId}>{book.name}</option>
					{/each}
				</select>
				<ChevronDown
					class="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground"
					strokeWidth={1.5}
				/>
			</span>
		</label>

		<label class="block flex-1">
			<span
				class="mb-1 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
			>
				Find a category
			</span>
			<span class="relative block">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
					strokeWidth={1.5}
				/>
				<input
					type="search"
					bind:value={search}
					placeholder="Search by name or icon..."
					class="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
				/>
			</span>
		</label>
	</div>

	<div class="flex items-center justify-between gap-5 sm:justify-end">
		<label class="flex cursor-pointer items-center gap-3">
			<span class="text-sm font-medium text-muted-foreground">Show archived</span>
			<input type="checkbox" class="peer sr-only" bind:checked={showArchived} />
			<span
				class="relative h-6 w-11 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
			></span>
		</label>
		<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
			{activeCount} active
		</span>
	</div>
</div>
