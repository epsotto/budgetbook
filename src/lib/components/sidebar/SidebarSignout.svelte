<script lang="ts">
	import { goto } from '$app/navigation';
	import { LogOut } from '@lucide/svelte';
	import { authClient } from '$lib/auth-client';

	async function signOut(event: MouseEvent) {
		event.preventDefault();
		await authClient.signOut();
		await goto('/login');
	}
</script>

<div
	class="border-t border-gray-200 px-3 py-4 text-muted-foreground hover:bg-accent hover:bg-accent/50 hover:text-accent-foreground"
>
	<!-- user avatar + name will go here -->
	<a href="/" onclick={signOut} class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
		<LogOut class="size-4 shrink-0" />
		Sign out
	</a>
</div>
