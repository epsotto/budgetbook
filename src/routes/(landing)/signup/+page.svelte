<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="flex flex-col items-center justify-center p-8 py-16">
	<div class="w-full max-w-2xl">
		<div class="mb-10 flex flex-col pl-2">
			<span class="text-sm font-bold tracking-wide text-primary uppercase">Get started</span>
			<h1 class="text-[2.5em] leading-tight font-bold">Simplify Your</h1>
			<h1 class="text-[2.5em] leading-tight font-bold text-primary">Personal Finances.</h1>
			<p class="mt-2 text-lg font-semibold text-muted-foreground">
				Take control of your budget, one book at a time
			</p>
		</div>

		<div class="rounded-[1.5em] border border-border/10 bg-surface-container-lowest p-10 shadow-sm">
			<form method="post" action="?/signup" class="grid grid-cols-2 gap-x-4 gap-y-4" use:enhance>
				<div>
					<label
						for="firstName"
						class="font-small semibold col-span-1 pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>First Name
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="text"
						id="firstName"
						name="firstName"
						placeholder="John"
						required
					/>
				</div>
				<div>
					<label
						for="lastName"
						class="font-small semibold pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>Last Name
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="text"
						id="lastName"
						name="lastName"
						required
						placeholder="Smith"
					/>
				</div>
				<div class="col-span-2">
					<label
						for="email"
						class="font-small semibold col-span-2 pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>Email Address
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l col-span-2 w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="email"
						id="email"
						name="email"
						placeholder="john.smith@email.com"
						required
					/>
				</div>
				<div class="col-span-2">
					<label
						for="email"
						class="font-small semibold col-span-2 pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>Retype Email Address
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l col-span-2 w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="email"
						id="retypeEmail"
						name="retypeEmail"
						required
						placeholder="john.smith@email.com"
					/>
				</div>
				<div>
					<label
						for="password"
						class="font-small semibold pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>Password
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="password"
						id="password"
						name="password"
						required
						placeholder="●●●●●●●"
					/>
				</div>
				<div>
					<label
						for="confirmPassword"
						class="font-small semibold pl-2 text-sm font-bold tracking-[0.05em] text-muted-foreground uppercase"
						>Confirm Password
					</label><input
						class="none focus:bg-surface-container.lowest focus:ring-l w-full rounded-md border border-border bg-surface-container-low px-6 py-4 text-foreground outline transition-all duration-200 focus:border-primary focus:ring-primary"
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						placeholder="●●●●●●●"
					/>
				</div>
				<button
					class="col-span-2 w-full rounded-md bg-primary py-4 text-primary-foreground"
					type="submit">Sign Up</button
				>
			</form>
			<p class="py-4 text-center text-destructive">{form?.message ?? ''}</p>
			<p class="mt-4 text-center">
				Already have an account? <a class="text-primary" href="/login">Login in</a>
			</p>
		</div>
	</div>
</section>
