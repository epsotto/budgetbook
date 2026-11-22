<script lang="ts">
	import { page } from '$app/state';
	import Sidebar from '@/components/sidebar/Sidebar.svelte';
	import { createBudgetBookStore, setBudgetBookStore } from '@/stores/budget-books.svelte';

	let { children, data } = $props();

	const showSidebar = $derived(!page.url.pathname.startsWith('/settings'));

	const bookStore = setBudgetBookStore(createBudgetBookStore(data.books));

	$effect(() => {
		try {
			bookStore.setBooks(data.books ?? []);
		} catch (error) {
			console.error('Failed to sync books into store', { books: data.books, error });
			throw error;
		}
	});

	$effect(() => {
		const bookId = page.params.bookId;
		bookStore.selectBook(typeof bookId === 'string' ? bookId : null);
	});
</script>

<div class="flex h-screen">
	{#if showSidebar}
		<Sidebar {bookStore} />
	{/if}
	<main class="flex-1 overflow-auto scroll-smooth">
		{@render children()}
	</main>
</div>
