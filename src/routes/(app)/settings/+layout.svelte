<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeft, Bell, ChevronRight, FolderOpen, Globe, User } from '@lucide/svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const tabs = [
		{
			href: '/settings/categories',
			label: 'Category Library',
			breadcrumb: 'CATEGORY LIBRARY',
			icon: FolderOpen
		},
		{
			href: '/settings/localisation',
			label: 'Localisation',
			breadcrumb: 'LOCALISATION',
			icon: Globe
		},
		{
			href: '/settings/notifications',
			label: 'Notifications',
			breadcrumb: 'NOTIFICATIONS',
			icon: Bell
		},
		{
			href: '/settings/profile',
			label: 'Profile',
			breadcrumb: 'PROFILE',
			icon: User
		}
	] as const;

	const railTabs = tabs.slice(0, 3);

	const activeTab = $derived(tabs.find((tab) => page.url.pathname.startsWith(tab.href)) ?? tabs[0]);

	const userName = $derived(String(data.user?.name ?? 'Account'));

	const initials = $derived(
		userName
			.split(' ')
			.map((part: string) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase() || '?'
	);
</script>

<div class="flex min-h-full bg-background">
	<aside
		class="hidden w-64 shrink-0 flex-col bg-surface-container-lowest py-10 md:flex"
		aria-label="Settings navigation"
	>
		<div class="mb-10 px-6">
			<a
				href={resolve('/dashboard')}
				class="block text-3xl font-black tracking-tighter text-foreground hover:opacity-80"
			>
				BudgetBook
			</a>
			<p class="mt-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
				Settings
			</p>
		</div>
		<nav class="flex flex-col">
			{#each railTabs as tab (tab.href)}
				<a
					href={resolve(tab.href)}
					aria-current={activeTab.href === tab.href ? 'page' : undefined}
					class="flex items-center gap-3 border-r-4 px-6 py-4 text-sm font-semibold tracking-wide transition-colors {activeTab.href ===
					tab.href
						? 'border-primary bg-surface-container-low text-primary'
						: 'border-transparent text-muted-foreground hover:bg-surface-container-low hover:text-foreground'}"
				>
					<tab.icon class="size-5 shrink-0" strokeWidth={1.5} />
					{tab.label}
				</a>
			{/each}
		</nav>
		<div class="mt-auto px-4">
			<a
				href={resolve('/settings/profile')}
				class="flex items-center gap-3 rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high"
			>
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
				>
					{initials}
				</span>
				<span class="min-w-0 flex-1">
					<span class="block truncate text-sm font-semibold text-foreground">
						{userName}
					</span>
					<span class="block text-xs font-medium text-muted-foreground">Profile</span>
				</span>
				<ChevronRight class="size-5 shrink-0 text-muted-foreground" />
			</a>
		</div>
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<header
			class="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest/90 px-6 py-6 backdrop-blur md:px-12"
		>
			<div class="flex flex-wrap items-center gap-5">
				<a
					href={resolve('/dashboard')}
					class="group inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft class="size-5 transition-transform group-hover:-translate-x-0.5" />
					Back to dashboard
				</a>
				<nav
					aria-label="Breadcrumb"
					class="flex text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
				>
					<span>Settings</span>
					<span class="mx-2 text-outline-variant">/</span>
					<span class="text-primary">{activeTab.breadcrumb}</span>
				</nav>
			</div>
			<a
				href={resolve('/settings/profile')}
				aria-label="Profile"
				class="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-container-low md:hidden"
			>
				<User class="size-5" />
			</a>
		</header>
		<div class="flex-1 px-6 py-6 pb-24 md:px-12 md:pb-6">
			<div class="mx-auto max-w-5xl">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<nav
	aria-label="Settings navigation"
	class="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around bg-surface-container-lowest md:hidden"
>
	{#each railTabs as tab (tab.href)}
		<a
			href={resolve(tab.href)}
			aria-label={tab.label}
			aria-current={activeTab.href === tab.href ? 'page' : undefined}
			class="flex flex-col items-center justify-center {activeTab.href === tab.href
				? 'text-primary'
				: 'text-muted-foreground'}"
		>
			<tab.icon class="size-5" />
		</a>
	{/each}
</nav>

<svelte:head>
	<title>{activeTab.label} · Settings · BudgetBook</title>
</svelte:head>
