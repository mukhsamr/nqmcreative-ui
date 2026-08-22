<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type FeatureColumns = 2 | 3 | 4;

	interface Props extends HTMLAttributes<HTMLElement> {
		eyebrow?: string;
		title?: string;
		description?: string;
		columns?: FeatureColumns;
		/** Hairline grid rather than free-standing cards. */
		bordered?: boolean;
		/** `FeatureCard`s, or anything else. */
		children: Snippet;
	}

	let {
		eyebrow,
		title,
		description,
		columns = 3,
		bordered = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const cols: Record<FeatureColumns, string> = {
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-2 lg:grid-cols-3',
		4: 'sm:grid-cols-2 lg:grid-cols-4'
	};
</script>

<section class="w-full px-6 py-20 {className}" {...rest}>
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-12">
		{#if eyebrow || title || description}
			<div class="flex max-w-xl flex-col gap-3">
				{#if eyebrow}
					<span class="font-mono text-xs tracking-wide text-text-muted uppercase">{eyebrow}</span>
				{/if}
				{#if title}
					<h2 class="font-heading text-3xl font-medium tracking-tight text-balance text-text">
						{title}
					</h2>
				{/if}
				{#if description}
					<p class="font-sans leading-relaxed text-pretty text-text-secondary">{description}</p>
				{/if}
			</div>
		{/if}

		<div
			class="grid {cols[columns]} {bordered
				? 'gap-px border border-hairline bg-hairline'
				: 'gap-10'}"
		>
			{@render children()}
		</div>
	</div>
</section>
