<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { BookPlus } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import type { BookFormResult } from '@/types/Books/budget-book-form';

	let name = $state('');
	const form = $derived(page.form as (BookFormResult & { bookId?: string }) | null);
	const createError = $derived(
		form?.action === 'createBook' && !form.success ? (form.message ?? null) : null
	);
</script>

<div class="flex h-full flex-col items-center justify-center p-8">
	<div class="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
		<div class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
			<BookPlus class="size-6" />
		</div>
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Create your first budget book</h1>
			<p class="text-sm text-muted-foreground">
				Budget books keep your categories, merchants, and transactions organized in one place.
			</p>
		</div>

		<form
			method="POST"
			action="?/createBook"
			class="flex w-full flex-col gap-3"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						const data = result.data as (BookFormResult & { bookId?: string }) | undefined;
						name = '';
						await invalidateAll();
						if (data?.bookId) {
							await goto(resolve(`/dashboard/${data.bookId}` as '/dashboard'));
						}
						return;
					}
					await update();
				};
			}}
		>
			<label class="flex flex-col gap-1.5 text-left">
				<span class="text-sm font-medium">Book name</span>
				<input
					type="text"
					name="name"
					bind:value={name}
					placeholder="e.g. Personal 2026"
					maxlength={100}
					required
					class="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
				/>
			</label>

			{#if createError}
				<p class="text-sm text-destructive" role="status">{createError}</p>
			{/if}

			<Button type="submit" class="h-10 w-full" disabled={!name.trim()}>
				Create budget book
			</Button>
		</form>
	</div>
</div>
