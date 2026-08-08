<script lang="ts">
	import { House } from '@lucide/svelte';
	import Dashboard from '@/components/dashboard/Dashboard.svelte';
</script>

<Dashboard bookName="Book 1" />

<div class="p-8">
	<div class="mb-6 flex items-center gap-2 text-muted-foreground">
		<House class="size-4" />
		<span class="text-sm font-medium">Dashboard</span>
	</div>

	<h1 class="mb-8 text-3xl font-bold tracking-tight">Welcome back!</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="mb-2 text-sm font-medium text-muted-foreground">Total Monthly Budget</h3>
			<p class="text-2xl font-bold">£3,450.00</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="mb-2 text-sm font-medium text-muted-foreground">Monthly Expenses</h3>
			<p class="text-2xl font-bold text-destructive">£1,240.50</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="mb-2 text-sm font-medium text-muted-foreground">Net Savings</h3>
			<p class="text-2xl font-bold text-primary">£2,209.50</p>
		</div>
	</div>

	<div class="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
		<h3 class="mb-4 text-lg font-semibold">Recent Transactions</h3>
		<p class="text-sm text-muted-foreground">
			Transactions will appear here once you start adding books.
		</p>
	</div>
</div>
