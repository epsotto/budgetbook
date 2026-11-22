<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import BookBudgetRules from '@/components/settings/categories/BookBudgetRules.svelte';
	import CategoryCard from '@/components/settings/categories/CategoryCard.svelte';
	import CategoryFormSheet from '@/components/settings/categories/CategoryFormSheet.svelte';
	import CategoryLibraryToolbar from '@/components/settings/categories/CategoryLibraryToolbar.svelte';
	import { Button } from '@/components/ui/button';
	import {
		DEFAULT_BOOK_RULES,
		DEFAULT_CATEGORY_LIBRARY,
		SAMPLE_CATEGORY_LIBRARY
	} from '@/data/sample-category-library';
	import { SAMPLE_BOOKS } from '@/data/sample-books';
	import { categoryColorValue } from '@/settings/category-colors';
	import type { BookBudgetRules as BookBudgetRulesType } from '@/types/Settings/budget-rules';
	import type { CategoryDraft, CategoryLibraryItem } from '@/types/Settings/category';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Until the settings load function exists, fall back to the app's sample books.
	const books = $derived(data.books?.length ? data.books : SAMPLE_BOOKS);

	let selectedBookId = $state(SAMPLE_BOOKS[0]?.bookId ?? '');
	let search = $state('');
	let showArchived = $state(false);
	let sheetOpen = $state(false);
	let editingCategory = $state<CategoryLibraryItem | null>(null);

	let categoriesByBook = $state<Record<string, CategoryLibraryItem[]>>(
		Object.fromEntries(
			Object.entries(SAMPLE_CATEGORY_LIBRARY).map(([bookId, categories]) => [
				bookId,
				categories.map((category) => ({ ...category }))
			])
		)
	);
	let rulesByBook = $state<Record<string, BookBudgetRulesType>>({});

	const activeBook = $derived(books.find((book) => book.bookId === selectedBookId) ?? null);
	const categories = $derived(categoriesByBook[selectedBookId] ?? DEFAULT_CATEGORY_LIBRARY);
	const activeCount = $derived(categories.filter((category) => !category.isArchived).length);
	const canManage = $derived(Boolean(activeBook) && activeBook?.role !== 'viewer');
	const canEditRules = $derived(activeBook?.role === 'owner');

	const visibleCategories = $derived(
		categories.filter((category) => {
			if (!showArchived && category.isArchived) return false;
			const query = search.trim().toLowerCase();
			if (!query) return true;
			return [category.name, category.description, category.icon].some((field) =>
				field.toLowerCase().includes(query)
			);
		})
	);

	$effect(() => {
		if (books.length && !books.some((book) => book.bookId === selectedBookId)) {
			selectedBookId = books[0].bookId;
		}
	});

	function createId(prefix: string) {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return `${prefix}-${crypto.randomUUID()}`;
		}
		return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	}

	function openCreate() {
		editingCategory = null;
		sheetOpen = true;
	}

	function openEdit(category: CategoryLibraryItem) {
		editingCategory = category;
		sheetOpen = true;
	}

	function saveCategory(draft: CategoryDraft) {
		const iconColor = categoryColorValue(draft.color);
		if (editingCategory) {
			categoriesByBook[selectedBookId] = categories.map((category) =>
				category.id === editingCategory?.id ? { ...category, ...draft, iconColor } : category
			);
		} else {
			categoriesByBook[selectedBookId] = [
				...categories,
				{
					id: createId('category'),
					...draft,
					iconColor,
					isArchived: false
				}
			];
		}
		editingCategory = null;
	}

	function toggleArchive(category: CategoryLibraryItem) {
		categoriesByBook[selectedBookId] = categories.map((item) =>
			item.id === category.id ? { ...item, isArchived: !item.isArchived } : item
		);
	}

	function deleteCategory(category: CategoryLibraryItem) {
		categoriesByBook[selectedBookId] = categories.filter((item) => item.id !== category.id);
	}
</script>

<div class="flex flex-wrap items-end justify-between gap-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Category Library</h2>
		<p class="mt-2 text-lg text-muted-foreground">
			Define the buckets that shape every month in {activeBook?.name ?? 'your budget book'}.
		</p>
	</div>
	<Button
		class="h-auto rounded-xl px-6 py-3 font-semibold shadow-lg shadow-primary/20"
		disabled={!canManage}
		onclick={openCreate}
	>
		<Plus />
		Add new category
	</Button>
</div>

<CategoryLibraryToolbar {books} bind:selectedBookId bind:search bind:showArchived {activeCount} />

{#if visibleCategories.length > 0}
	<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
		{#each visibleCategories as category (category.id)}
			<CategoryCard
				{category}
				{canManage}
				onEdit={openEdit}
				onToggleArchive={toggleArchive}
				onDelete={deleteCategory}
			/>
		{/each}
	</div>
{:else}
	<div class="mt-8 rounded-xl bg-surface-container-low p-8 text-center text-muted-foreground">
		{search.trim()
			? `No categories match “${search.trim()}”.`
			: 'No categories here yet. Add one to get started.'}
	</div>
{/if}

<BookBudgetRules
	bookName={activeBook?.name ?? 'this book'}
	rules={rulesByBook[selectedBookId] ?? DEFAULT_BOOK_RULES}
	canEdit={canEditRules}
	onChange={(rules) => (rulesByBook[selectedBookId] = rules)}
/>

<CategoryFormSheet bind:open={sheetOpen} category={editingCategory} onSave={saveCategory} />
