<script>
	import SidebarBookList from './SidebarBookList.svelte';
	import SidebarSettingsLink from './SidebarSettingsLink.svelte';
	import SidebarSharedList from './SidebarSharedList.svelte';
	import SidebarUserAvatar from './SidebarUserAvatar.svelte';
</script>

<div class="flex h-full w-[20%] flex-col border-r border-gray-300">
	<h1 class="primary px-3 py-4 text-lg font-bold tracking-wide">BudgetBook</h1>
	<SidebarBookList></SidebarBookList>
	<SidebarSharedList></SidebarSharedList>
	<div class="mt-auto">
		<SidebarSettingsLink></SidebarSettingsLink>
		<SidebarUserAvatar></SidebarUserAvatar>
	</div>
</div>
