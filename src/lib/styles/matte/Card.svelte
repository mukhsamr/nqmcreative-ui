<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorderLeft, toneHoverBorder, toneSurface, type Tone } from '../../core/tones.js';

	export type CardVariant = 'outline' | 'filled' | 'tinted';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: CardVariant;
		tone?: Tone;
		/** Draws a 2px tone-coloured rule down the left edge. */
		accent?: boolean;
		/** Lifts the border to the tone colour on hover — use for clickable cards. */
		interactive?: boolean;
		padded?: boolean;
		title?: string;
		eyebrow?: string;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let {
		variant = 'outline',
		tone = 'brand',
		accent = false,
		interactive = false,
		padded = true,
		title,
		eyebrow,
		header,
		footer,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants = $derived({
		outline: 'border border-hairline bg-bg',
		filled: 'border border-hairline bg-bg-alt',
		tinted: `border ${toneSurface[tone]} border-transparent`
	});
</script>

<div
	class="flex flex-col {variants[variant]}
		{accent ? `border-l-2 ${toneBorderLeft[tone]}` : ''}
		{interactive ? `transition-colors duration-150 ease-brand-out ${toneHoverBorder[tone]}` : ''}
		{className}"
	{...rest}
>
	{#if header || title || eyebrow}
		<div class="flex flex-col gap-1 {padded ? 'px-6 pt-6' : ''}">
			{#if header}
				{@render header()}
			{:else}
				{#if eyebrow}
					<span class="font-mono text-xs tracking-wide text-text-muted uppercase">{eyebrow}</span>
				{/if}
				{#if title}
					<h3 class="font-heading text-lg font-medium text-text">{title}</h3>
				{/if}
			{/if}
		</div>
	{/if}

	<div class="flex-1 {padded ? (header || title || eyebrow ? 'px-6 pt-4 pb-6' : 'p-6') : ''}">
		{@render children()}
	</div>

	{#if footer}
		<div class="border-t border-hairline {padded ? 'px-6 py-4' : ''}">
			{@render footer()}
		</div>
	{/if}
</div>
