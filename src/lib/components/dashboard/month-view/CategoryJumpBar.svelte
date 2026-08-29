<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { Category } from '@/types/Settings/category';

	let {
		categories,
		activeCategoryId,
		onCategoryClick
	}: {
		categories: Category[];
		activeCategoryId: string;
		onCategoryClick: (id: string) => void;
	} = $props();
</script>

<div class="custom-scrollbar flex items-center gap-4 overflow-x-auto pb-2">
	{#each categories as category (category.name)}
		<Button
			href="#cat-{category.name}"
			variant={activeCategoryId === category.name ? 'default' : 'outline'}
			size="lg"
			class={cn(
				'rounded-full p-4 whitespace-nowrap',
				activeCategoryId !== category.name && 'border-border bg-white'
			)}
			onclick={() => onCategoryClick(category.name)}
		>
			{category.name}
		</Button>
	{/each}
</div>
