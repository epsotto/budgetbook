<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="box box-shadow flex items-center justify-center">
	<div
		class="m-10 flex max-w-md animate-in flex-col gap-4 rounded-[1.5em] bg-surface-container-lowest px-16 py-8 duration-500 slide-in-from-bottom-5 fade-in lg:p-16"
	>
		<h1
			class="text-[2.5em] leading-[1.05] font-bold tracking-[-0.04em] text-foreground text-primary lg:text-[3.5em]"
		>
			Welcome back!
		</h1>
		<p class="text-[1.2em] text-muted-foreground">
			Enter your credentials to start using Budgetbook
		</p>

		<form class="flex flex-col gap-8" method="post" action="/login" use:enhance>
			<label class="font-small semibold text-sm tracking-[0.05em] text-muted-foreground uppercase">
				Email
				<input
					class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
					type="email"
					name="email"
				/>
			</label>
			<label class="font-small semibold text-sm tracking-[0.05em] text-muted-foreground uppercase">
				Password
				<input
					class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
					type="password"
					name="password"
				/>
			</label>
			<button class="w-full rounded-md bg-primary py-4 text-primary-foreground" type="submit"
				>Login</button
			>
		</form>
		<p class="text-red-500">{form?.message ?? ''}</p>
	</div>
</section>
