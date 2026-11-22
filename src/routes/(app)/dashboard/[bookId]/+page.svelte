<script lang="ts">
	import Dashboard from '@/components/dashboard/Dashboard.svelte';

	let { data } = $props();
</script>

{#key data.book.bookId}
	<Dashboard
		bookId={data.book.bookId}
		bookName={data.book.name}
		initialCategories={data.dashboard.categories}
		initialMerchantList={data.dashboard.merchantList}
	/>
{/key}
