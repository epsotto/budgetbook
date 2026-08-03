<script>
	import PageHeader from './PageHeader.svelte';

	let { bookName } = $props();
</script>

<PageHeader {bookName} monthLabel="Month" view="month" onViewChange={() => {}} />
