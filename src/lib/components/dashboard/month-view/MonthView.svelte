<script lang="ts">
	import type { Category } from '@/types/Settings/category';
	import CategoryJumpBar from './CategoryJumpBar.svelte';
	import CategorySections from './CategorySections.svelte';
	import TransactionDrawer from './TransactionDrawer.svelte';
	import type { Merchant } from '@/types/Transactions/merchant';

	let {
		categories,
		bookName,
		merchantList
	}: { categories: Category[]; bookName: string; merchantList: Merchant[] } = $props();

	let activeCategoryId = $state(categories?.[0]?.name ?? '');
	let jumpBarHeight = $state(0);

	function handleCategoryClick(id: string) {
		activeCategoryId = id;
	}

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((e) => e.isIntersecting);
				if (visible) {
					activeCategoryId = visible.target.id.replace('cat-', '');
				}
			},
			{ rootMargin: '-20% 0px -60% 0px' }
		);

		const sections = document.querySelectorAll('[data-category-section]');
		sections.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
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
				<CategorySections {category} merchants={merchantList} />
			</div>
		{/each}
	</div>
</div>

<TransactionDrawer
	open={false}
	title="Add Transaction"
	{bookName}
	category="Uncategorized"
	items={[{ amount: 100, date: '2023-01-01', description: 'Sample Transaction' }]}
/>
