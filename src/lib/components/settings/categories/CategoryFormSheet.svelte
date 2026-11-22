<script lang="ts">
	import { X } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import { categoryIcons, defaultIcon } from '@/icons';
	import { categoryColorOptions } from '@/settings/category-colors';
	import type {
		CategoryColorKey,
		CategoryDraft,
		CategoryLibraryItem
	} from '@/types/Settings/category';

	const ICON_CHOICES = [
		'home',
		'film',
		'utensils',
		'shopping-cart',
		'car',
		'bus',
		'zap',
		'lightbulb',
		'wallet',
		'heart-pulse',
		'book-open',
		'plane'
	] as const;

	let {
		open = $bindable(false),
		category = null,
		onSave
	}: {
		open: boolean;
		category: CategoryLibraryItem | null;
		onSave: (draft: CategoryDraft) => void;
	} = $props();

	let dialog: HTMLDialogElement;
	let name = $state('');
	let description = $state('');
	let icon = $state<string>(ICON_CHOICES[0]);
	let color = $state<CategoryColorKey>('blue');
	let budget = $state('');
	let error = $state('');

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	$effect(() => {
		if (!open) return;
		name = category?.name ?? '';
		description = category?.description ?? '';
		icon = category?.icon ?? ICON_CHOICES[0];
		color = category?.color ?? 'blue';
		budget = category ? String(category.budget) : '';
		error = '';
	});

	function close() {
		open = false;
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		error = '';

		const trimmedName = name.trim();
		if (!trimmedName) {
			error = 'Enter a category name.';
			return;
		}

		const amount = Number(budget);
		if (!Number.isFinite(amount) || amount <= 0) {
			error = 'Enter a monthly cap greater than $0.00.';
			return;
		}

		onSave({
			name: trimmedName,
			description: description.trim(),
			icon,
			color,
			budget: Math.round((amount + Number.EPSILON) * 100) / 100
		});
		close();
	}
</script>

<dialog
	bind:this={dialog}
	onclose={close}
	aria-labelledby="category-sheet-title"
	class="w-[min(34rem,calc(100vw-2rem))] rounded-xl bg-surface-container-lowest p-0 text-foreground shadow-atmospheric-lg backdrop:bg-foreground/30 backdrop:backdrop-blur-sm"
>
	<form onsubmit={handleSubmit}>
		<header class="flex items-start justify-between gap-4 bg-surface-container-low px-8 py-6">
			<div>
				<h3 id="category-sheet-title" class="text-xl font-bold">
					{category ? 'Edit category' : 'New category'}
				</h3>
				<p class="mt-1 text-sm text-muted-foreground">
					Give this bucket a name, icon, colour, and monthly cap.
				</p>
			</div>
			<Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onclick={close}>
				<X class="size-5" strokeWidth={1.5} />
			</Button>
		</header>

		<div class="flex flex-col gap-6 px-8 py-8">
			<label class="flex flex-col gap-2">
				<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Category name
				</span>
				<input
					type="text"
					bind:value={name}
					placeholder="e.g. Insurance"
					maxlength="60"
					autocomplete="off"
					class="rounded-lg bg-surface-container-low px-3 py-2.5 text-sm font-semibold focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
				/>
			</label>

			<label class="flex flex-col gap-2">
				<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Description
				</span>
				<textarea
					bind:value={description}
					rows="2"
					placeholder="What does this category cover?"
					class="resize-none rounded-lg bg-surface-container-low px-3 py-2.5 text-sm focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
				></textarea>
			</label>

			<fieldset>
				<legend class="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Icon
				</legend>
				<div class="grid grid-cols-6 gap-2">
					{#each ICON_CHOICES as choice (choice)}
						{@const ChoiceIcon = categoryIcons[choice] ?? defaultIcon}
						<button
							type="button"
							aria-label={`Use ${choice} icon`}
							aria-pressed={icon === choice}
							onclick={() => (icon = choice)}
							class="flex aspect-square items-center justify-center rounded-lg transition-colors {icon ===
							choice
								? 'bg-primary text-primary-foreground'
								: 'bg-surface-container-low text-muted-foreground hover:bg-surface-container-high hover:text-foreground'}"
						>
							<ChoiceIcon class="size-5" strokeWidth={1.5} />
						</button>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend class="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Colour
				</legend>
				<div class="flex flex-wrap gap-3">
					{#each categoryColorOptions as option (option.key)}
						<button
							type="button"
							aria-label={`Use ${option.label} colour`}
							aria-pressed={color === option.key}
							onclick={() => (color = option.key)}
							class="size-8 rounded-full transition-transform hover:scale-110 {color === option.key
								? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest'
								: ''}"
							style="background-color: {option.value}"
						></button>
					{/each}
				</div>
			</fieldset>

			<label class="flex flex-col gap-2">
				<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Monthly cap
				</span>
				<span class="relative block">
					<span
						class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
					>
						$
					</span>
					<input
						type="number"
						min="0"
						step="0.01"
						inputmode="decimal"
						bind:value={budget}
						placeholder="0.00"
						class="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-7 text-sm font-semibold focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
					/>
				</span>
			</label>

			{#if error}
				<p role="alert" class="text-sm text-destructive">{error}</p>
			{/if}
		</div>

		<footer class="flex justify-end gap-3 bg-surface-container-low px-8 py-5">
			<Button type="button" variant="secondary" onclick={close}>Cancel</Button>
			<Button type="submit">
				{category ? 'Save changes' : 'Add category'}
			</Button>
		</footer>
	</form>
</dialog>
