<script lang="ts">
	import { Download, Plus } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';

	let {
		onExportCsv,
		onAddCategory
	}: {
		onExportCsv: () => void;
		onAddCategory: (name: string, budget: number) => void;
	} = $props();

	let isAddingCategory = $state(false);
	let newCategoryName = $state('');
	let newCategoryBudget = $state('');
	let formError = $state('');

	function handleStartAdding() {
		newCategoryName = '';
		newCategoryBudget = '';
		formError = '';
		isAddingCategory = true;
	}

	function handleCancel() {
		newCategoryName = '';
		newCategoryBudget = '';
		formError = '';
		isAddingCategory = false;
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const name = newCategoryName.trim();
		const budget = Number.parseFloat(newCategoryBudget);

		if (!name) {
			formError = 'Enter a category name.';
			return;
		}

		if (!Number.isFinite(budget) || budget <= 0) {
			formError = 'Enter a monthly budget greater than $0.00.';
			return;
		}

		onAddCategory(name, Math.round((budget + Number.EPSILON) * 100) / 100);
		handleCancel();
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex flex-col gap-0.5">
			<h2 class="text-xl font-semibold">Yearly Budget Spreadsheet</h2>
			<p class="text-sm text-muted-foreground">
				Monthly spending by category and item for the selected year.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button variant="outline" class="h-10" onclick={onExportCsv}>
				<Download />
				Export CSV
			</Button>
			<Button class="h-10" onclick={handleStartAdding}>
				<Plus />
				Add Category
			</Button>
		</div>
	</div>

	{#if isAddingCategory}
		<form
			class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-low p-4"
			onsubmit={handleSubmit}
		>
			<div class="flex min-w-48 flex-1 flex-col gap-1.5">
				<label for="new-category-name" class="text-xs font-medium text-muted-foreground">
					Category name
				</label>
				<input
					id="new-category-name"
					type="text"
					bind:value={newCategoryName}
					placeholder="e.g. Insurance"
					autocomplete="off"
					class="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
				/>
			</div>
			<div class="flex w-40 flex-col gap-1.5">
				<label for="new-category-budget" class="text-xs font-medium text-muted-foreground">
					Monthly budget
				</label>
				<div class="relative">
					<span
						class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
					>
						$
					</span>
					<input
						id="new-category-budget"
						type="number"
						min="0"
						step="0.01"
						bind:value={newCategoryBudget}
						placeholder="0.00"
						inputmode="decimal"
						class="h-9 w-full rounded-md border border-border bg-background pr-3 pl-7 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
					/>
				</div>
			</div>
			<Button type="submit" class="h-9">Save Category</Button>
			<Button type="button" variant="outline" class="h-9" onclick={handleCancel}>Cancel</Button>
			{#if formError}
				<p role="alert" class="w-full text-sm text-destructive">{formError}</p>
			{/if}
		</form>
	{/if}
</div>
