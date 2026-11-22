<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Check, Pencil, Plus, Trash2, X } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import type { BudgetBook } from '@/types/Books/budget-book';
	import type { BookFormResult } from '@/types/Books/budget-book-form';

	let { books, activeBookId }: { books: BudgetBook[]; activeBookId: string | null } = $props();

	let isAdding = $state(false);
	let newBookName = $state('');
	let editingBookId = $state<string | null>(null);
	let editingBookName = $state('');
	let showDeleteDialog = $state(false);
	let newBookInput = $state<HTMLInputElement | null>(null);
	let editingBookInput = $state<HTMLInputElement | null>(null);

	const bookForm = $derived(page.form as BookFormResult | null);

	$effect(() => {
		if (isAdding) newBookInput?.focus();
	});

	$effect(() => {
		if (editingBookId) editingBookInput?.focus();
	});

	function handleStartAdding() {
		showDeleteDialog = false;
		editingBookId = null;
		editingBookName = '';
		newBookName = '';
		isAdding = true;
	}

	function handleCancelAdding() {
		newBookName = '';
		isAdding = false;
	}

	function handleStartEditing(book: BudgetBook) {
		showDeleteDialog = false;
		isAdding = false;
		newBookName = '';
		editingBookId = book.bookId;
		editingBookName = book.name;
	}

	function handleCancelEditing() {
		editingBookId = null;
		editingBookName = '';
	}

	function handleDeleteRequest() {
		if (!editingBookId) return;
		showDeleteDialog = true;
	}

	function handleCancelDelete() {
		showDeleteDialog = false;
	}

	function handleAddKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			handleCancelAdding();
		}
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			handleCancelEditing();
		}
	}

	function handleBookListKeydown(event: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

		const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-book-link]'));
		const currentIndex = links.indexOf(event.currentTarget as HTMLAnchorElement);
		if (currentIndex === -1) return;

		event.preventDefault();

		let nextIndex = currentIndex;
		if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % links.length;
		else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + links.length) % links.length;
		else if (event.key === 'Home') nextIndex = 0;
		else if (event.key === 'End') nextIndex = links.length - 1;

		links[nextIndex]?.focus();
	}

	const createError = $derived(
		bookForm?.action === 'createBook' && !bookForm.success ? (bookForm.message ?? null) : null
	);
	const renameError = $derived(
		bookForm?.action === 'renameBook' && !bookForm.success ? (bookForm.message ?? null) : null
	);
	const deleteError = $derived(
		bookForm?.action === 'deleteBook' && !bookForm.success ? (bookForm.message ?? null) : null
	);
</script>

<div class="flex flex-col gap-2 px-3 py-4">
	<div class="flex items-center justify-between gap-2">
		<h1 class="text-s font-semibold tracking-widest text-muted-foreground uppercase">
			My Budget Books
		</h1>
		<Button
			variant="default"
			size="icon-sm"
			class="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
			aria-label="Add budget book"
			title="Add budget book"
			onclick={handleStartAdding}
		>
			<Plus />
		</Button>
	</div>

	{#if createError && !isAdding}
		<p class="px-2 text-xs text-destructive" role="status">{createError}</p>
	{/if}
	{#if renameError && !editingBookId}
		<p class="px-2 text-xs text-destructive" role="status">{renameError}</p>
	{/if}
	{#if deleteError && !showDeleteDialog}
		<p class="px-2 text-xs text-destructive" role="status">{deleteError}</p>
	{/if}

	<ul class="flex flex-col gap-1" aria-label="My budget books">
		{#each books as book (book.bookId)}
			{@const isActive = book.bookId === activeBookId}
			<li>
				{#if editingBookId === book.bookId}
					<form
						method="POST"
						action="/dashboard?/renameBook"
						class="flex flex-col gap-1.5 rounded-md bg-accent/40 px-2 py-1"
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									editingBookId = null;
									editingBookName = '';
									await invalidateAll();
									return;
								}
								await update();
							};
						}}
					>
						<input type="hidden" name="bookId" value={book.bookId} />
						<div class="flex items-center gap-1.5">
							<input
								bind:this={editingBookInput}
								type="text"
								name="name"
								bind:value={editingBookName}
								aria-label="Budget book name"
								maxlength={100}
								required
								onkeydown={handleEditKeydown}
								class="h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
							/>
							<Button
								type="submit"
								size="icon-xs"
								class="shrink-0 bg-success text-success-foreground hover:bg-success/90"
								aria-label="Save budget book"
								title="Save"
								disabled={!editingBookName.trim()}
							>
								<Check />
							</Button>
							<Button
								type="button"
								size="icon-xs"
								class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
								aria-label="Cancel editing budget book"
								title="Cancel"
								onclick={handleCancelEditing}
							>
								<X />
							</Button>
							<Button
								type="button"
								size="icon-xs"
								class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
								aria-label="Delete budget book"
								title="Delete"
								onclick={handleDeleteRequest}
							>
								<Trash2 />
							</Button>
						</div>
						{#if renameError}
							<p class="text-xs text-destructive" role="status">{renameError}</p>
						{/if}
					</form>
				{:else}
					<div
						class="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm {isActive
							? 'bg-accent font-medium text-accent-foreground'
							: 'hover:bg-accent hover:text-accent-foreground'}"
					>
						<a
							href={resolve(`/dashboard/${book.bookId}` as '/dashboard')}
							aria-current={isActive ? 'page' : undefined}
							data-book-link
							onkeydown={handleBookListKeydown}
							class="flex min-w-0 flex-1 items-center gap-2.5"
						>
							<span
								class="size-2 shrink-0 rounded-full {isActive
									? 'bg-primary'
									: 'bg-muted-foreground/40'}"
							></span>
							<span class="truncate">{book.name}</span>
						</a>
						<Button
							variant="ghost"
							size="icon-xs"
							class="shrink-0 text-muted-foreground hover:text-foreground"
							aria-label={`Edit ${book.name}`}
							title={`Edit ${book.name}`}
							onclick={() => handleStartEditing(book)}
						>
							<Pencil />
						</Button>
					</div>
				{/if}
			</li>
		{/each}
		{#if books.length === 0 && !isAdding}
			<li class="px-2 py-1.5 text-sm text-muted-foreground">
				No budget books yet. Add one to get started.
			</li>
		{/if}
		{#if isAdding}
			<li>
				<form
					method="POST"
					action="/dashboard?/createBook"
					class="flex flex-col gap-1.5 rounded-md bg-accent/40 px-2 py-1"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								const data = result.data as (BookFormResult & { bookId?: string }) | undefined;
								newBookName = '';
								isAdding = false;
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
					<div class="flex items-center gap-1.5">
						<input
							bind:this={newBookInput}
							type="text"
							name="name"
							bind:value={newBookName}
							placeholder="Book name"
							aria-label="New budget book name"
							maxlength={100}
							required
							onkeydown={handleAddKeydown}
							class="h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
						/>
						<Button
							type="submit"
							size="icon-xs"
							class="shrink-0 bg-success text-success-foreground hover:bg-success/90"
							aria-label="Save budget book"
							title="Save"
							disabled={!newBookName.trim()}
						>
							<Check />
						</Button>
						<Button
							type="button"
							size="icon-xs"
							class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
							aria-label="Cancel adding budget book"
							title="Cancel"
							onclick={handleCancelAdding}
						>
							<X />
						</Button>
					</div>
					{#if createError}
						<p class="text-xs text-destructive" role="status">{createError}</p>
					{/if}
				</form>
			</li>
		{/if}
	</ul>
</div>

<AlertDialog.Root bind:open={showDeleteDialog}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0"
		/>
		<AlertDialog.Content
			class="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95"
		>
			<AlertDialog.Title class="text-lg font-semibold">Delete this budget book?</AlertDialog.Title>
			<AlertDialog.Description class="mt-2 text-sm text-muted-foreground">
				This will permanently remove
				<span class="font-medium text-foreground">&ldquo;{editingBookName}&rdquo;</span>
				and everything inside it. This action cannot be undone.
			</AlertDialog.Description>
			{#if deleteError}
				<p class="mt-3 text-sm text-destructive" role="status">{deleteError}</p>
			{/if}
			<div class="mt-6 flex flex-row justify-end gap-3">
				<Button variant="outline" class="h-10" onclick={handleCancelDelete}>Cancel</Button>
				<form
					method="POST"
					action="/dashboard?/deleteBook"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								const data = result.data as
									| (BookFormResult & { deletedBookId?: string; nextBookId?: string | null })
									| undefined;
								showDeleteDialog = false;
								editingBookId = null;
								editingBookName = '';
								await invalidateAll();
								const deletedId = data?.deletedBookId;
								const currentBookId = page.params.bookId;
								if (deletedId && currentBookId === deletedId) {
									const next = data?.nextBookId;
									if (next) {
										await goto(resolve(`/dashboard/${next}` as '/dashboard'));
									} else {
										await goto(resolve('/dashboard'));
									}
								}
								return;
							}
							await update();
						};
					}}
				>
					<input type="hidden" name="bookId" value={editingBookId ?? ''} />
					<Button
						type="submit"
						variant="destructive"
						class="h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</Button>
				</form>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
