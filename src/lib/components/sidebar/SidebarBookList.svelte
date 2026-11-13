<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Check, Pencil, Plus, Trash2, X } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import type { BudgetBook } from '@/types/Books/budget-book';

	let {
		books,
		activeBookId,
		onBookSelected,
		onBookAdded,
		onBookUpdated,
		onBookDeleted
	}: {
		books: BudgetBook[];
		activeBookId: string | null;
		onBookSelected: (bookId: string) => void;
		onBookAdded: (name: string) => void;
		onBookUpdated: (bookId: string, name: string) => void;
		onBookDeleted: (bookId: string) => void;
	} = $props();

	let isAdding = $state(false);
	let newBookName = $state('');
	let editingBookId = $state<string | null>(null);
	let editingBookName = $state('');
	let showDeleteDialog = $state(false);
	let newBookInput = $state<HTMLInputElement | null>(null);
	let editingBookInput = $state<HTMLInputElement | null>(null);

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

	function handleAddBook() {
		const name = newBookName.trim();
		if (!name) return;

		onBookAdded(name);
		newBookName = '';
		isAdding = false;
		goto(resolve('/dashboard'));
	}

	function handleSelectBook(bookId: string) {
		showDeleteDialog = false;
		handleCancelAdding();
		handleCancelEditing();
		onBookSelected(bookId);
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

	function handleUpdateBook() {
		const name = editingBookName.trim();
		if (!editingBookId || !name) return;

		onBookUpdated(editingBookId, name);
		handleCancelEditing();
	}

	function handleDeleteRequest() {
		if (!editingBookId) return;

		showDeleteDialog = true;
	}

	function handleCancelDelete() {
		showDeleteDialog = false;
	}

	function handleConfirmDelete() {
		if (!editingBookId) return;

		onBookDeleted(editingBookId);
		showDeleteDialog = false;
		handleCancelEditing();
	}

	function handleKeydown(event: KeyboardEvent, action: 'add' | 'edit') {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (action === 'add') handleAddBook();
			else handleUpdateBook();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			if (action === 'add') handleCancelAdding();
			else handleCancelEditing();
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
	<ul class="flex flex-col gap-1" aria-label="My budget books">
		{#each books as book (book.bookId)}
			{@const isActive = book.bookId === activeBookId}
			<li>
				{#if editingBookId === book.bookId}
					<div class="flex items-center gap-1.5 rounded-md bg-accent/40 px-2 py-1">
						<input
							bind:this={editingBookInput}
							type="text"
							bind:value={editingBookName}
							aria-label="Budget book name"
							onkeydown={(event) => handleKeydown(event, 'edit')}
							class="h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
						/>
						<Button
							size="icon-xs"
							class="shrink-0 bg-success text-success-foreground hover:bg-success/90"
							aria-label="Save budget book"
							title="Save"
							disabled={!editingBookName.trim()}
							onclick={handleUpdateBook}
						>
							<Check />
						</Button>
						<Button
							size="icon-xs"
							class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
							aria-label="Cancel editing budget book"
							title="Cancel"
							onclick={handleCancelEditing}
						>
							<X />
						</Button>
						<Button
							size="icon-xs"
							class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
							aria-label="Delete budget book"
							title="Delete"
							onclick={handleDeleteRequest}
						>
							<Trash2 />
						</Button>
					</div>
				{:else}
					<div
						class="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm {isActive
							? 'bg-accent font-medium text-accent-foreground'
							: 'hover:bg-accent hover:text-accent-foreground'}"
					>
						<a
							href={resolve('/dashboard')}
							aria-current={isActive ? 'page' : undefined}
							data-book-link
							onclick={() => handleSelectBook(book.bookId)}
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
				<div class="flex items-center gap-1.5 rounded-md bg-accent/40 px-2 py-1">
					<input
						bind:this={newBookInput}
						type="text"
						bind:value={newBookName}
						placeholder="Book name"
						aria-label="New budget book name"
						onkeydown={(event) => handleKeydown(event, 'add')}
						class="h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
					/>
					<Button
						size="icon-xs"
						class="shrink-0 bg-success text-success-foreground hover:bg-success/90"
						aria-label="Save budget book"
						title="Save"
						disabled={!newBookName.trim()}
						onclick={handleAddBook}
					>
						<Check />
					</Button>
					<Button
						size="icon-xs"
						class="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
						aria-label="Cancel adding budget book"
						title="Cancel"
						onclick={handleCancelAdding}
					>
						<X />
					</Button>
				</div>
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
			<div class="mt-6 flex flex-row justify-end gap-3">
				<Button variant="outline" class="h-10" onclick={handleCancelDelete}>Cancel</Button>
				<Button
					variant="destructive"
					class="h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
					onclick={handleConfirmDelete}
				>
					Delete
				</Button>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
