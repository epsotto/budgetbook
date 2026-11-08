<script lang="ts">
	import { untrack } from 'svelte';
	import { Trash2 } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	type TransactionDraft = Pick<TransactionItem, 'date' | 'amount' | 'description'>;

	let {
		transaction = null,
		formId,
		dirty = $bindable(false),
		onSubmit,
		onDelete
	}: {
		transaction?: TransactionItem | null;
		formId: string;
		dirty?: boolean;
		onSubmit: (draft: TransactionDraft) => void;
		onDelete?: () => void;
	} = $props();

	const initial = untrack(() => ({
		description: transaction?.description ?? '',
		amount: transaction ? transaction.amount.toFixed(2) : '',
		date: transaction?.date ?? todayISO()
	}));

	let description = $state(initial.description);
	let amount = $state(initial.amount);
	let date = $state(initial.date);
	let formError = $state('');
	let descriptionInput = $state<HTMLInputElement | null>(null);
	let supportsCurrencyInput = $state(false);

	// HTML has no native currency input type, so fall back to a sanitised text input.
	$effect(() => {
		const probe = document.createElement('input');
		probe.type = 'currency';
		supportsCurrencyInput = probe.type === 'currency';
	});

	$effect(() => {
		descriptionInput?.focus();
	});

	$effect(() => {
		dirty =
			description !== initial.description || amount !== initial.amount || date !== initial.date;
	});

	function todayISO() {
		const now = new Date();
		const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
		return local.toISOString().slice(0, 10);
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
		amount = sanitised;
	}

	function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		formError = '';

		const trimmedDescription = description.trim();
		const parsedAmount = Number(amount);
		const dateIsValid =
			/^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T00:00:00Z`).getTime());

		if (!trimmedDescription) {
			formError = 'Enter a description for this transaction.';
			return;
		}

		if (!amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			formError = 'Enter an amount greater than $0.00.';
			return;
		}

		if (!dateIsValid) {
			formError = 'Choose a valid date.';
			return;
		}

		onSubmit({
			date,
			description: trimmedDescription,
			amount: Math.round((parsedAmount + Number.EPSILON) * 100) / 100
		});
	}
</script>

<form
	id={formId}
	class="mt-auto flex flex-col gap-4 border-t border-border bg-muted/20 p-6"
	onsubmit={handleSubmit}
>
	<div class="flex flex-row items-center justify-between gap-4">
		<div class="flex flex-col gap-0.5">
			<h3 class="text-sm font-semibold">
				{transaction ? 'Edit transaction' : 'New transaction'}
			</h3>
			<p class="text-xs text-muted-foreground">
				{transaction ? 'Update the details below.' : 'Add the details below.'}
			</p>
		</div>
		{#if onDelete}
			<Button
				type="button"
				variant="destructive"
				class="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
				onclick={onDelete}
			>
				<Trash2 />
				Delete
			</Button>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<label for="{formId}-description" class="text-sm font-medium">Description</label>
		<input
			bind:this={descriptionInput}
			id="{formId}-description"
			type="text"
			bind:value={description}
			placeholder="e.g. Weekly shop"
			autocomplete="off"
			class="h-10 w-full rounded-md border border-border bg-background px-3 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
		/>
	</div>

	<div class="grid grid-cols-1 gap-4">
		<div class="flex min-w-0 flex-col gap-2">
			<label for="{formId}-amount" class="text-sm font-medium">Amount</label>
			<div class="relative">
				<span
					class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
				>
					$
				</span>
				{#if supportsCurrencyInput}
					<input
						id="{formId}-amount"
						type="currency"
						value={amount}
						oninput={handleAmountInput}
						placeholder="0.00"
						inputmode="decimal"
						autocomplete="transaction-amount"
						class="h-10 w-full rounded-md border border-border bg-background pr-3 pl-7 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
					/>
				{:else}
					<input
						id="{formId}-amount"
						type="text"
						value={amount}
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
			<label for="{formId}-date" class="text-sm font-medium">Date</label>
			<input
				id="{formId}-date"
				type="date"
				bind:value={date}
				class="h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
			/>
		</div>
	</div>

	{#if formError}
		<p role="alert" class="text-sm text-destructive">{formError}</p>
	{/if}
</form>
