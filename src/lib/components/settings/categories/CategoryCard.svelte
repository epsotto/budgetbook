<script lang="ts">
	import { Archive, MoreVertical, Pencil, RotateCcw, Trash2 } from '@lucide/svelte';
	import * as Popover from '@/components/ui/popover';
	import { categoryIcons, defaultIcon } from '@/icons';
	import { categoryTileStyle } from '@/settings/category-colors';
	import type { CategoryLibraryItem } from '@/types/Settings/category';

	let {
		category,
		canManage = true,
		onEdit,
		onToggleArchive,
		onDelete
	}: {
		category: CategoryLibraryItem;
		canManage?: boolean;
		onEdit: (category: CategoryLibraryItem) => void;
		onToggleArchive: (category: CategoryLibraryItem) => void;
		onDelete: (category: CategoryLibraryItem) => void;
	} = $props();

	let menuOpen = $state(false);

	let Icon = $derived(categoryIcons[category.icon] ?? defaultIcon);

	function runAction(action: (category: CategoryLibraryItem) => void) {
		menuOpen = false;
		action(category);
	}

	function handleDelete() {
		if (!confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
		runAction(onDelete);
	}
</script>

<article
	class="group flex flex-col rounded-xl bg-surface-container-lowest p-8 shadow-atmospheric-sm transition-transform duration-300 hover:-translate-y-1"
>
	<div class="mb-6 flex items-start justify-between">
		<div
			class="flex size-12 items-center justify-center rounded-lg"
			style={categoryTileStyle(category.color)}
		>
			<Icon class="size-6" strokeWidth={1.5} />
		</div>

		<Popover.Root bind:open={menuOpen}>
			<Popover.Trigger
				aria-label={`Category actions for ${category.name}`}
				class="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-container-high disabled:opacity-50"
				disabled={!canManage}
			>
				<MoreVertical class="size-5" strokeWidth={1.5} />
			</Popover.Trigger>
			<Popover.Content
				align="end"
				class="gap-0 rounded-xl bg-surface-container-lowest p-1.5 shadow-atmospheric-md ring-foreground/5"
			>
				<button
					type="button"
					class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-container-low"
					onclick={() => runAction(onEdit)}
				>
					<Pencil class="size-4" strokeWidth={1.5} />
					Edit category
				</button>
				<button
					type="button"
					class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-container-low"
					onclick={() => runAction(onToggleArchive)}
				>
					{#if category.isArchived}
						<RotateCcw class="size-4" strokeWidth={1.5} />
						Restore category
					{:else}
						<Archive class="size-4" strokeWidth={1.5} />
						Archive category
					{/if}
				</button>
				<button
					type="button"
					class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
					onclick={handleDelete}
				>
					<Trash2 class="size-4" strokeWidth={1.5} />
					Delete category
				</button>
			</Popover.Content>
		</Popover.Root>
	</div>

	<h3 class="mb-1 text-xl font-bold">{category.name}</h3>
	<p class="mb-6 text-sm text-muted-foreground">{category.description}</p>

	<div class="-mx-8 mt-auto -mb-8 rounded-b-xl bg-surface-container-low/60 px-8 py-6">
		<div class="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
			{category.isArchived ? 'Archived' : 'Monthly cap'}
		</div>
		<div class="text-2xl font-black">${category.budget.toFixed(2)}</div>
	</div>
</article>
