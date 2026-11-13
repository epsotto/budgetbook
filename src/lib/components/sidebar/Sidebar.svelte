<script lang="ts">
	import { resolve } from '$app/paths';
	import type { BudgetBookStore } from '@/stores/budget-books.svelte';
	import SidebarBookList from './SidebarBookList.svelte';
	import SidebarSettingsLink from './SidebarSettingsLink.svelte';
	import SidebarSharedList from './SidebarSharedList.svelte';
	import SidebarSignout from './SidebarSignout.svelte';
	import SidebarUserAvatar from './SidebarUserAvatar.svelte';

	let { bookStore }: { bookStore: BudgetBookStore } = $props();
</script>

<div class="flex h-full w-[20%] flex-col border-r border-gray-300">
	<a
		href={resolve('/dashboard')}
		class="primary block px-3 py-4 text-lg font-bold tracking-wide hover:opacity-80">BudgetBook</a
	>
	<SidebarBookList
		books={bookStore.books}
		activeBookId={bookStore.activeBookId}
		onBookSelected={bookStore.selectBook}
		onBookAdded={bookStore.addBook}
		onBookUpdated={bookStore.renameBook}
		onBookDeleted={bookStore.deleteBook}
	></SidebarBookList>
	<SidebarSharedList></SidebarSharedList>
	<div class="mt-auto">
		<SidebarSettingsLink></SidebarSettingsLink>
		<SidebarUserAvatar></SidebarUserAvatar>
		<SidebarSignout></SidebarSignout>
	</div>
</div>
