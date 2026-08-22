<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorderSoft, toneSolid, toneSurface, type Tone } from '../../core/tones.js';

	export type CTAVariant = 'tinted' | 'solid' | 'outline';

	interface Props extends HTMLAttributes<HTMLElement> {
		title: string;
		description?: string;
		tone?: Tone;
		variant?: CTAVariant;
		/** Side by side on wide screens instead of stacked and centred. */
		inline?: boolean;
		/** The buttons. */
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		tone = 'brand',
		variant = 'tinted',
		inline = false,
		actions,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants = $derived({
		tinted: `${toneSurface[tone]} border ${toneBorderSoft[tone]}`,
		solid: toneSolid[tone],
		outline: `bg-bg border ${toneBorderSoft[tone]}`
	});

	const onSolid = $derived(variant === 'solid');
</script>

<section class="w-full px-6 py-16 {className}" {...rest}>
	<div
		class="mx-auto flex w-full max-w-6xl gap-8 p-10 sm:p-14 {variants[variant]}
			{inline
			? 'flex-col lg:flex-row lg:items-center lg:justify-between'
			: 'flex-col items-center text-center'}"
	>
		<div class="flex min-w-0 flex-col gap-3 {inline ? '' : 'items-center'}">
			<h2
				class="max-w-2xl font-heading text-3xl font-medium tracking-tight text-balance {onSolid
					? 'text-text-inverse'
					: 'text-text'}"
			>
				{title}
			</h2>
			{#if description}
				<p
					class="max-w-xl font-sans leading-relaxed text-pretty {onSolid
						? 'text-text-inverse/80'
						: 'text-text-secondary'}"
				>
					{description}
				</p>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if actions}
			<div class="flex shrink-0 flex-wrap items-center gap-3 {inline ? '' : 'justify-center'}">
				{@render actions()}
			</div>
		{/if}
	</div>
</section>
