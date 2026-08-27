<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorderLeft, toneHoverBorder, toneSurface, type Tone } from '../../core/tones.js';
	import { iconLg } from './icon.js';
	import { soft, softOnHover } from './lift.js';

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
		/** Leading icon above the title. Ignored when you pass `header`. */
		icon?: Snippet;
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
		icon,
		header,
		footer,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// The default card is the one the style is named for: cream, a hairline, and
	// the lip. `filled` and `tinted` stay flat on purpose — a tinted panel that
	// also floats is two claims about the same box.
	const variants = $derived({
		outline: `border border-hairline bg-bg ${soft}`,
		filled: 'border border-hairline bg-bg-alt',
		tinted: `border border-transparent ${toneSurface[tone]}`
	});
</script>

<div
	class="flex flex-col rounded-[28px] {variants[variant]}
		{accent ? `border-l-4 ${toneBorderLeft[tone]}` : ''}
		{interactive
		? `transition-[box-shadow,transform,border-color] duration-150 ease-brand-out hover:-translate-y-0.5 ${softOnHover} ${toneHoverBorder[tone]}`
		: ''}
		{className}"
	{...rest}
>
	{#if header || title || eyebrow || icon}
		<div class="flex flex-col gap-1 {padded ? 'px-6 pt-6' : ''}">
			{#if header}
				{@render header()}
			{:else}
				{#if icon}<span class={iconLg}>{@render icon()}</span>{/if}
				{#if eyebrow}
					<span class="font-sans text-xs font-semibold text-text-muted">{eyebrow}</span>
				{/if}
				{#if title}
					<h3 class="font-heading text-base font-semibold text-text">{title}</h3>
				{/if}
			{/if}
		</div>
	{/if}

	<div class="flex-1 {padded ? (header || title || eyebrow ? 'px-6 pt-3 pb-6' : 'p-6') : ''}">
		{@render children()}
	</div>

	{#if footer}
		<div class="rounded-b-[28px] border-t border-hairline bg-bg-alt {padded ? 'px-6 py-4' : ''}">
			{@render footer()}
		</div>
	{/if}
</div>
