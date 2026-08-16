<script lang="ts">
	import PageHeader from './PageHeader.svelte';
	import TransactionDrawer from './TransactionDrawer.svelte';

	let { bookName, view = 'month' } = $props();

	function handleViewChange(newView: string) {
		view = newView;
	}
</script>

<PageHeader {bookName} {view} onViewChange={handleViewChange} />
<TransactionDrawer
	open={true}
	title="Add Transaction"
	{bookName}
	category="Uncategorized"
	items={[{ amount: 100, date: '2023-01-01', description: 'Sample Transaction' }]}
/>
