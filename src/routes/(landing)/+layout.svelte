<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background">
	<header class="flex items-center justify-between bg-surface-container-lowest px-8 py-8">
		<h1 class="text-lg font-bold">BudgetBook</h1>
		<nav class="flex items-center gap-4">
			<a class="text-sm uppercase" href="/features">Features</a>
			<a class="text-sm uppercase" href="/pricing">Pricing</a>
			<a class="text-sm uppercase" href="/signup">Sign Up</a>
		</nav>
	</header>

	<main class="surface-container-low primary-background flex-1">
		{@render children()}
	</main>
	<footer class="items-right flex justify-between bg-surface-container-low px-8 py-12">
		<p class="text-xs text-muted-foreground uppercase">© 2026 BudgetBook Ltd</p>
		<nav class="flex items-center gap-4">
			<a class="text-sm uppercase" href="/privacy-policy">Privacy Policy</a>
			<a class="text-sm uppercase" href="/terms-of-service">Terms of Service</a>
			<a class="text-sm uppercase" href="/help">Help</a>
		</nav>
	</footer>
</div>
