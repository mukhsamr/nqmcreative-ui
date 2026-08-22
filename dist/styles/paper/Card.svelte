<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorderLeft, toneHoverBorder, toneSurface, type Tone } from '../../core/tones.js';

	export type CardVariant = 'outline' | 'filled' | 'tinted';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: CardVariant;
		tone?: Tone;
		/** Draws a tone-coloured rule down the left edge. */
		accent?: boolean;
		/** Lifts the card on hover — use for clickable cards. */
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
		outline: 'border border-hairline bg-bg shadow-xs',
		filled: 'border border-hairline bg-bg-alt',
		tinted: `border border-transparent ${toneSurface[tone]}`
	});
</script>

<div
	class="flex flex-col rounded-lg {variants[variant]}
		{accent ? `border-l-4 ${toneBorderLeft[tone]}` : ''}
		{interactive
		? `transition-shadow duration-150 ease-brand-out hover:shadow-md ${toneHoverBorder[tone]}`
		: ''}
		{className}"
	{...rest}
>
	{#if header || title || eyebrow}
		<div class="flex flex-col gap-1 {padded ? 'px-5 pt-5' : ''}">
			{#if header}
				{@render header()}
			{:else}
				{#if eyebrow}
					<span class="font-sans text-xs font-semibold text-text-muted">{eyebrow}</span>
				{/if}
				{#if title}
					<h3 class="font-heading text-base font-semibold text-text">{title}</h3>
				{/if}
			{/if}
		</div>
	{/if}

	<div class="flex-1 {padded ? (header || title || eyebrow ? 'px-5 pt-3 pb-5' : 'p-5') : ''}">
		{@render children()}
	</div>

	{#if footer}
		<div class="rounded-b-lg border-t border-hairline bg-bg-alt {padded ? 'px-5 py-3.5' : ''}">
			{@render footer()}
		</div>
	{/if}
</div>
