<script lang="ts">
	import { Settings } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<div class="border-t border-gray-200 px-3 py-3">
	<a
		href="/settings"
		class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground {page.url.pathname.startsWith(
			'/settings'
		)
			? 'bg-accent text-accent-foreground'
			: 'text-muted-foreground'}"
	>
		<Settings class="size-4 shrink-0" />
		Settings
	</a>
</div>
