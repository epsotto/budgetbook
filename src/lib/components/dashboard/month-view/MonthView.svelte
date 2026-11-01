<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import CategoryJumpBar from './CategoryJumpBar.svelte';
	import CategorySections from './CategorySections.svelte';
	import TransactionDrawer from './TransactionDrawer.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';
	import type { TransactionItem } from '@/types/Transactions/transaction-item';

	let {
		categories,
		bookName,
		merchantList,
		onTransactionAdded
	}: {
		categories: Category[];
		bookName: string;
		merchantList: Merchant[];
		onTransactionAdded: (merchantId: string, transaction: TransactionItem) => void;
	} = $props();

	let activeCategoryId = $state(categories?.[0]?.name ?? '');
	let jumpBarHeight = $state(0);
	let scrollDebounceTimer: ReturnType<typeof setTimeout> | undefined;
	let transactionDrawerOpen = $state(false);
	let selectedMerchantId = $state<string | null>(null);
	let selectedMerchant = $derived(
		merchantList.find((merchant) => merchant.id === selectedMerchantId) ?? null
	);
	let selectedCategoryName = $derived(
		categories.find((category) => category.id === selectedMerchant?.categoryId)?.name ??
			'Uncategorised'
	);

	const SCROLL_DEBOUNCE_MS = 150;

	function handleCategoryClick(id: string) {
		clearTimeout(scrollDebounceTimer);
		activeCategoryId = id;
	}

	function handleMerchantClick(merchant: Merchant) {
		selectedMerchantId = merchant.id;
		transactionDrawerOpen = true;
	}

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((e) => e.isIntersecting);
				if (visible) {
					const id = visible.target.id.replace('cat-', '');
					clearTimeout(scrollDebounceTimer);
					scrollDebounceTimer = setTimeout(() => {
						activeCategoryId = id;
					}, SCROLL_DEBOUNCE_MS);
				}
			},
			{ rootMargin: '-20% 0px -60% 0px' }
		);

		const sections = document.querySelectorAll('[data-category-section]');
		sections.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
			clearTimeout(scrollDebounceTimer);
		};
	});
</script>

<div class="width-full flex flex-1 flex-col p-8 pt-0" style="--jump-bar-height: {jumpBarHeight}px;">
	<div
		bind:clientHeight={jumpBarHeight}
		class="sticky top-[var(--sticky-header-offset)] z-20 bg-linear-to-b from-background from-85% to-transparent pt-4 pb-4"
	>
		<CategoryJumpBar {categories} {activeCategoryId} onCategoryClick={handleCategoryClick} />
	</div>
	<div class="flex flex-1 flex-col gap-4 px-10 pb-12">
		{#each categories as category (category.name)}
			<div
				id="cat-{category.name}"
				data-category-section
				class="scroll-mt-[calc(var(--sticky-header-offset)_+_var(--jump-bar-height))]"
			>
				<CategorySections
					{category}
					merchants={merchantList}
					onMerchantClick={handleMerchantClick}
				/>
			</div>
		{/each}
	</div>
</div>

<TransactionDrawer
	open={transactionDrawerOpen}
	merchant={selectedMerchant}
	categoryName={selectedCategoryName}
	{bookName}
	onOpenChange={(state) => (transactionDrawerOpen = state)}
	{onTransactionAdded}
/>
