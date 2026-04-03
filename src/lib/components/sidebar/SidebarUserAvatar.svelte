<script>
	import { User } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<div class="border-t border-gray-200 px-3 py-3">
	<!-- user avatar + name will go here -->
	<a
		href="/profile"
		class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground {page.url.pathname.startsWith(
			'/profile'
		)
			? 'bg-accent text-accent-foreground'
			: 'text-muted-foreground'}"
	>
		<User class="size-4 shrink-0" />
		Test User
	</a>
</div>
