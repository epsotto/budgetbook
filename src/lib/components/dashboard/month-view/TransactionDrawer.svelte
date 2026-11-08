<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import * as Drawer from '@/components/ui/drawer';
	import { Button } from '@/components/ui/button';
	import TransactionForm from './TransactionForm.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let {
		open = false,
		merchant,
		categoryName,
		bookName,
		onOpenChange,
		onTransactionAdded,
		onTransactionUpdated,
		onTransactionDeleted
	}: {
		open: boolean;
		merchant: Merchant | null;
		categoryName: string;
		bookName: string;
		onOpenChange?: (open: boolean) => void;
		onTransactionAdded: (merchantId: string, transaction: TransactionItem) => void;
		onTransactionUpdated: (merchantId: string, transaction: TransactionItem) => void;
		onTransactionDeleted: (merchantId: string, transactionId: string) => void;
	} = $props();

	const formId = 'transaction-form';
	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	let isAdding = $state(false);
	let selectedTransactionId = $state<string | null>(null);
	let formDirty = $state(false);
	let showDiscardDialog = $state(false);
	let showDeleteDialog = $state(false);
	let activeMerchantId = $state<string | null>(null);

	let title = $derived(merchant ? `${merchant.name} Transactions` : 'Transactions');
	let transactions = $derived(merchant?.transactions ?? []);
	let total = $derived(
		transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
	);
	let selectedTransaction = $derived(
		transactions.find((transaction) => transaction.transactionId === selectedTransactionId) ?? null
	);
	let isFormOpen = $derived(isAdding || selectedTransaction !== null);
	let formKey = $derived(isAdding ? 'new' : (selectedTransaction?.transactionId ?? 'none'));

	$effect(() => {
		const id = merchant?.id ?? null;
		if (id !== activeMerchantId) {
			activeMerchantId = id;
			resetForm();
			showDiscardDialog = false;
			showDeleteDialog = false;
		}
	});

	function formatAmount(amount: number) {
		return `$${Number(amount).toFixed(2)}`;
	}

	function formatDate(date: string) {
		const parsed = new Date(`${date}T00:00:00Z`);
		return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
	}

	function resetForm() {
		isAdding = false;
		selectedTransactionId = null;
		formDirty = false;
	}

	function handleStartAdding() {
		if (!merchant) return;

		selectedTransactionId = null;
		formDirty = false;
		isAdding = true;
	}

	function handleSelectTransaction(transactionId: string) {
		if (!isAdding && transactionId === selectedTransactionId) return;

		isAdding = false;
		formDirty = false;
		selectedTransactionId = transactionId;
	}

	function handleCancelForm() {
		resetForm();
	}

	function handleDrawerCloseRequest() {
		if (isFormOpen && formDirty) {
			showDiscardDialog = true;
			return;
		}

		resetForm();
		onOpenChange?.(false);
	}

	function handleKeepEditing() {
		showDiscardDialog = false;
	}

	function handleDiscardAndClose() {
		showDiscardDialog = false;
		resetForm();
		onOpenChange?.(false);
	}

	function handleSubmit(draft: Pick<TransactionItem, 'date' | 'amount' | 'description'>) {
		if (!merchant) return;

		if (isAdding) {
			onTransactionAdded(merchant.id, {
				transactionId: crypto.randomUUID(),
				...draft
			});
		} else if (selectedTransaction) {
			onTransactionUpdated(merchant.id, { ...selectedTransaction, ...draft });
		}

		resetForm();
	}

	function handleDeleteRequest() {
		showDeleteDialog = true;
	}

	function handleCancelDelete() {
		showDeleteDialog = false;
	}

	function handleConfirmDelete() {
		if (merchant && selectedTransaction) {
			onTransactionDeleted(merchant.id, selectedTransaction.transactionId);
		}

		showDeleteDialog = false;
		resetForm();
	}
</script>

<Drawer.Root {open} direction="right" dismissible={false} {onOpenChange}>
	<Drawer.Content class="data-[vaul-drawer-direction=right]:rounded-l-none">
		<Drawer.Header class="flex flex-row items-start justify-between p-6">
			<div class="flex flex-col gap-0.5 text-left">
				<Drawer.Title class="text-xl font-semibold">{title}</Drawer.Title>
				<Drawer.Description>
					{bookName} &#9679; {categoryName}
				</Drawer.Description>
			</div>
			<button
				type="button"
				class="cursor-pointer rounded-none p-1 text-muted-foreground hover:text-foreground"
				aria-label="Close transaction drawer"
				onclick={handleDrawerCloseRequest}
			>
				<X class="h-5 w-5" />
			</button>
		</Drawer.Header>

		<div class="flex w-full flex-1 flex-col overflow-y-auto bg-background">
			{#if transactions.length > 0}
				<div class="flex flex-col gap-4 p-6">
					{#each transactions as transaction (transaction.transactionId)}
						{@const isSelected = transaction.transactionId === selectedTransactionId}
						<button
							type="button"
							class="flex w-full cursor-pointer flex-row items-start justify-between gap-4 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-tint/5 {isSelected
								? 'bg-surface-tint/10'
								: ''}"
							aria-pressed={isSelected}
							onclick={() => handleSelectTransaction(transaction.transactionId)}
						>
							<div class="flex flex-col gap-0.5">
								<span class="text-body-lg">{transaction.description}</span>
								<span class="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
							</div>
							<span class="shrink-0 text-body-lg text-primary"
								>{formatAmount(transaction.amount)}</span
							>
						</button>
					{/each}
				</div>
			{:else if !isFormOpen}
				<div class="flex flex-1 items-center justify-center p-6">
					<span class="text-center text-muted-foreground">No transactions found.</span>
				</div>
			{/if}

			{#if isFormOpen}
				{#key formKey}
					<TransactionForm
						transaction={isAdding ? null : selectedTransaction}
						{formId}
						bind:dirty={formDirty}
						onSubmit={handleSubmit}
						onDelete={isAdding ? undefined : handleDeleteRequest}
					/>
				{/key}
			{/if}
		</div>

		{#if merchant}
			<div class="flex flex-row items-baseline justify-between gap-4 bg-muted/60 px-6 py-4">
				<span class="text-muted-foreground">Total for {merchant.name}</span>
				<span class="text-xl font-semibold">{formatAmount(total)}</span>
			</div>
		{/if}

		<Drawer.Footer class="mt-0 bg-muted/30 p-6">
			{#if isFormOpen}
				<div class="flex w-full flex-row gap-3">
					<Button variant="outline" class="h-10 flex-1" onclick={handleCancelForm}>Cancel</Button>
					<Button type="submit" form={formId} class="h-10 flex-1">
						{isAdding ? 'Add Transaction' : 'Save Changes'}
					</Button>
				</div>
			{:else}
				<Button
					variant="default"
					class="h-10 w-full"
					disabled={!merchant}
					onclick={handleStartAdding}
				>
					Add Transaction
				</Button>
			{/if}
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<AlertDialog.Root bind:open={showDiscardDialog}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0"
		/>
		<AlertDialog.Content
			class="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95"
		>
			<AlertDialog.Title class="text-lg font-semibold">Discard your changes?</AlertDialog.Title>
			<AlertDialog.Description class="mt-2 text-sm text-muted-foreground">
				You have unsaved changes. Closing now will discard them.
			</AlertDialog.Description>
			<div class="mt-6 flex flex-row justify-end gap-3">
				<Button variant="outline" class="h-10" onclick={handleKeepEditing}>Keep Editing</Button>
				<Button variant="destructive" class="h-10" onclick={handleDiscardAndClose}>
					Discard &amp; Close
				</Button>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

<AlertDialog.Root bind:open={showDeleteDialog}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0"
		/>
		<AlertDialog.Content
			class="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95"
		>
			<AlertDialog.Title class="text-lg font-semibold">Delete this transaction?</AlertDialog.Title>
			<AlertDialog.Description class="mt-2 text-sm text-muted-foreground">
				This will permanently remove
				<span class="font-medium text-foreground"
					>&ldquo;{selectedTransaction?.description}&rdquo;</span
				>. This action cannot be undone.
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
