<script lang="ts">
	import PageHeader from './PageHeader.svelte';

	let { bookName, view = 'month' } = $props();

	function handleViewChange(newView: string) {
		view = newView;
	}
</script>

<PageHeader {bookName} {view} onViewChange={handleViewChange} />
