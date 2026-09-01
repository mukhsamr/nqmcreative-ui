<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface Logo {
		name: string;
		src?: string;
		href?: string;
	}

	interface Props extends HTMLAttributes<HTMLElement> {
		title?: string;
		/** Without `src` the name is set in the heading face — fine for wordmarks. */
		logos?: Logo[];
		/** Dim until hovered, so the row does not compete with the headline. */
		muted?: boolean;
		/** Your own markup instead of `logos`. */
		children?: Snippet;
	}

	let {
		title,
		logos = [],
		muted = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<section class="w-full px-6 py-14 {className}" {...rest}>
	<div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
		{#if title}
			<p class="text-center font-sans text-[13px] font-medium text-text-muted">{title}</p>
		{/if}

		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
			{#if children}
				{@render children()}
			{:else}
				{#each logos as logo (logo.name)}
					<svelte:element
						this={logo.href ? 'a' : 'div'}
						href={logo.href}
						class="flex items-center rounded-md transition-all duration-200 ease-brand-out {muted
							? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
							: ''}"
					>
						{#if logo.src}
							<img src={logo.src} alt={logo.name} class="h-7 w-auto object-contain" />
						{:else}
							<span class="font-heading text-lg font-semibold tracking-tight text-text-secondary">
								{logo.name}
							</span>
						{/if}
					</svelte:element>
				{/each}
			{/if}
		</div>
	</div>
</section>
