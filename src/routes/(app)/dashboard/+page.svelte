<script lang="ts">
	import { House } from '@lucide/svelte';
</script>

<div class="p-8">
	<div class="flex items-center gap-2 text-muted-foreground mb-6">
		<House class="size-4" />
		<span class="text-sm font-medium">Dashboard</span>
	</div>

	<h1 class="text-3xl font-bold tracking-tight mb-8">Welcome back!</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="text-sm font-medium text-muted-foreground mb-2">Total Monthly Budget</h3>
			<p class="text-2xl font-bold">£3,450.00</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="text-sm font-medium text-muted-foreground mb-2">Monthly Expenses</h3>
			<p class="text-2xl font-bold text-destructive">£1,240.50</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h3 class="text-sm font-medium text-muted-foreground mb-2">Net Savings</h3>
			<p class="text-2xl font-bold text-primary">£2,209.50</p>
		</div>
	</div>

	<div class="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
		<h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
		<p class="text-sm text-muted-foreground">Transactions will appear here once you start adding books.</p>
	</div>
</div>
