<script>
	import Sidebar from '@/components/sidebar/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="flex h-screen">
	<Sidebar />
	<main class="flex-1 overflow-auto scroll-smooth">
		{@render children()}
	</main>
</div>
