<script lang="ts">
	import Dashboard from '@/components/dashboard/Dashboard.svelte';
	import { getBudgetBookStore } from '@/stores/budget-books.svelte';

	const bookStore = getBudgetBookStore();
</script>

{#if bookStore.activeBook}
	{@const activeBook = bookStore.activeBook}
	{#key activeBook.bookId}
		<Dashboard bookId={activeBook.bookId} bookName={activeBook.name} />
	{/key}
{:else}
	<div class="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
		<h1 class="text-2xl font-semibold">No budget books yet</h1>
		<p class="max-w-sm text-sm text-muted-foreground">
			Create your first budget book with the + button in the sidebar to get started.
		</p>
	</div>
{/if}
