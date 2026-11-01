<script lang="ts">
	import { tick } from 'svelte';
	import { AlertDialog } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import * as Drawer from '@/components/ui/drawer';
	import { Button } from '@/components/ui/button';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let {
		open = false,
		merchant,
		categoryName,
		bookName,
		onOpenChange,
		onTransactionAdded
	}: {
		open: boolean;
		merchant: Merchant | null;
		categoryName: string;
		bookName: string;
		onOpenChange?: (open: boolean) => void;
		onTransactionAdded: (merchantId: string, transaction: TransactionItem) => void;
	} = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	let isAdding = $state(false);
	let showDiscardDialog = $state(false);
	let newDescription = $state('');
	let newAmount = $state('');
	let newDate = $state(todayISO());
	let formError = $state('');
	let descriptionInput = $state<HTMLInputElement | null>(null);
	let activeMerchantId = $state<string | null>(null);
	let supportsCurrencyInput = $state(false);

	// HTML has no native currency input type, so fall back to a sanitised text input.
	$effect(() => {
		const probe = document.createElement('input');
		probe.type = 'currency';
		supportsCurrencyInput = probe.type === 'currency';
	});

	let title = $derived(merchant ? `${merchant.name} Transactions` : 'Transactions');
	let transactions = $derived(merchant?.transactions ?? []);
	let total = $derived(
		transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
	);

	$effect(() => {
		const id = merchant?.id ?? null;
		if (id !== activeMerchantId) {
			activeMerchantId = id;
			isAdding = false;
			showDiscardDialog = false;
			resetDraft();
		}
	});

	function todayISO() {
		const now = new Date();
		const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
		return local.toISOString().slice(0, 10);
	}

	function formatAmount(amount: number) {
		return `$${Number(amount).toFixed(2)}`;
	}

	function formatDate(date: string) {
		const parsed = new Date(`${date}T00:00:00Z`);
		return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
	}

	function sanitiseCurrency(value: string) {
		const cleaned = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
		const decimalIndex = cleaned.indexOf('.');

		if (decimalIndex === -1) return cleaned;

		return (
			cleaned.slice(0, decimalIndex + 1) +
			cleaned
				.slice(decimalIndex + 1)
				.replace(/\./g, '')
				.slice(0, 2)
		);
	}

	function handleAmountInput(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const sanitised = sanitiseCurrency(input.value);

		if (input.value !== sanitised) input.value = sanitised;
		newAmount = sanitised;
	}

	function resetDraft() {
		newDescription = '';
		newAmount = '';
		newDate = todayISO();
		formError = '';
	}

	async function handleStartAdding() {
		if (!merchant) return;

		resetDraft();
		isAdding = true;
		await tick();
		descriptionInput?.focus();
	}

	function handleCancel() {
		isAdding = false;
		resetDraft();
	}

	function handleDrawerCloseRequest() {
		if (isAdding) {
			showDiscardDialog = true;
			return;
		}

		onOpenChange?.(false);
	}

	function handleInteractOutside(event: PointerEvent) {
		if (!isAdding || showDiscardDialog) return;

		event.preventDefault();
		showDiscardDialog = true;
	}

	function handleEscapeKeydown(event: KeyboardEvent) {
		if (!isAdding || showDiscardDialog) return;

		event.preventDefault();
		showDiscardDialog = true;
	}

	function handleKeepEditing() {
		showDiscardDialog = false;
	}

	function handleDiscardAndClose() {
		showDiscardDialog = false;
		isAdding = false;
		resetDraft();
		onOpenChange?.(false);
	}

	function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		formError = '';

		if (!merchant) return;

		const description = newDescription.trim();
		const amount = Number(newAmount);
		const dateIsValid =
			/^\d{4}-\d{2}-\d{2}$/.test(newDate) &&
			!Number.isNaN(new Date(`${newDate}T00:00:00Z`).getTime());

		if (!description) {
			formError = 'Enter a description for this transaction.';
			return;
		}

		if (!newAmount || !Number.isFinite(amount) || amount <= 0) {
			formError = 'Enter an amount greater than $0.00.';
			return;
		}

		if (!dateIsValid) {
			formError = 'Choose a valid date.';
			return;
		}

		const transaction: TransactionItem = {
			date: newDate,
			description,
			amount: Math.round((amount + Number.EPSILON) * 100) / 100
		};

		onTransactionAdded(merchant.id, transaction);

		isAdding = false;
		resetDraft();
	}
</script>

<Drawer.Root {open} direction="right" dismissible={!isAdding} {onOpenChange}>
	<Drawer.Content
		class="data-[vaul-drawer-direction=right]:rounded-l-none"
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
	>
		<Drawer.Header class="flex flex-row items-start justify-between p-6">
			<div class="flex flex-col gap-0.5 text-left">
				<Drawer.Title class="text-xl font-semibold">{title}</Drawer.Title>
				<Drawer.Description>
					{bookName} &#9679; {categoryName}
				</Drawer.Description>
			</div>
			<button
				type="button"
				class="rounded-none p-1 text-muted-foreground hover:text-foreground"
				aria-label="Close transaction drawer"
				onclick={handleDrawerCloseRequest}
			>
				<X class="h-5 w-5" />
			</button>
		</Drawer.Header>

		<div class="flex w-full flex-1 flex-col overflow-y-auto bg-background">
			{#if transactions.length > 0}
				<div class="flex flex-col gap-4 p-6">
					{#each transactions as transaction (transaction)}
						<div class="flex flex-row items-start justify-between gap-4">
							<div class="flex flex-col gap-0.5">
								<span class="text-body-lg">{transaction.description}</span>
								<span class="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
							</div>
							<span class="shrink-0 text-body-lg text-primary"
								>{formatAmount(transaction.amount)}</span
							>
						</div>
					{/each}
				</div>
			{:else if !isAdding}
				<div class="flex flex-1 items-center justify-center p-6">
					<span class="text-center text-muted-foreground">No transactions found.</span>
				</div>
			{/if}

			{#if isAdding}
				<form
					id="new-transaction-form"
					class="mt-auto flex flex-col gap-4 border-t border-border bg-muted/20 p-6"
					onsubmit={handleSubmit}
				>
					<div class="flex flex-col gap-2">
						<label for="new-transaction-description" class="text-sm font-medium">
							Description
						</label>
						<input
							bind:this={descriptionInput}
							id="new-transaction-description"
							type="text"
							bind:value={newDescription}
							placeholder="e.g. Weekly shop"
							autocomplete="off"
							class="h-10 w-full rounded-md border border-border bg-background px-3 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4">
						<div class="flex min-w-0 flex-col gap-2">
							<label for="new-transaction-amount" class="text-sm font-medium">Amount</label>
							<div class="relative">
								<span
									class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
								>
									$
								</span>
								{#if supportsCurrencyInput}
									<input
										id="new-transaction-amount"
										type="currency"
										value={newAmount}
										oninput={handleAmountInput}
										placeholder="0.00"
										inputmode="decimal"
										autocomplete="transaction-amount"
										class="h-10 w-full rounded-md border border-border bg-background pr-3 pl-7 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
									/>
								{:else}
									<input
										id="new-transaction-amount"
										type="text"
										value={newAmount}
										oninput={handleAmountInput}
										placeholder="0.00"
										inputmode="decimal"
										autocomplete="transaction-amount"
										class="h-10 w-full rounded-md border border-border bg-background pr-3 pl-7 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
									/>
								{/if}
							</div>
						</div>

						<div class="flex min-w-0 flex-col gap-2">
							<label for="new-transaction-date" class="text-sm font-medium">Date</label>
							<input
								id="new-transaction-date"
								type="date"
								bind:value={newDate}
								class="h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
							/>
						</div>
					</div>

					{#if formError}
						<p role="alert" class="text-sm text-destructive">{formError}</p>
					{/if}
				</form>
			{/if}
		</div>

		{#if merchant}
			<div class="flex flex-row items-baseline justify-between gap-4 bg-muted/60 px-6 py-4">
				<span class="text-muted-foreground">Total for {merchant.name}</span>
				<span class="text-xl font-semibold">{formatAmount(total)}</span>
			</div>
		{/if}

		<Drawer.Footer class="mt-0 bg-muted/30 p-6">
			{#if isAdding}
				<div class="flex w-full flex-row gap-3">
					<Button variant="outline" class="h-10 flex-1" onclick={handleCancel}>Cancel</Button>
					<Button type="submit" form="new-transaction-form" class="h-10 flex-1">Submit</Button>
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
			<AlertDialog.Title class="text-lg font-semibold">Discard this transaction?</AlertDialog.Title>
			<AlertDialog.Description class="mt-2 text-sm text-muted-foreground">
				You are still adding a transaction. Closing now will discard it.
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
