<script lang="ts">
	import Sidebar from '@/components/sidebar/Sidebar.svelte';
	import { SAMPLE_BOOKS } from '@/data/sample-books';
	import { createBudgetBookStore, setBudgetBookStore } from '@/stores/budget-books.svelte';

	let { children } = $props();

	const bookStore = setBudgetBookStore(createBudgetBookStore(SAMPLE_BOOKS));
</script>

<div class="flex h-screen">
	<Sidebar {bookStore} />
	<main class="flex-1 overflow-auto scroll-smooth">
		{@render children()}
	</main>
</div>
