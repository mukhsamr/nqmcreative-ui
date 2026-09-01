<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { focusRing, toneHoverText, toneRing, toneText, type Tone } from '../../core/tones.js';
	import { iconSm } from './icon.js';

	interface Props extends HTMLAnchorAttributes {
		tone?: Tone;
		/** `'hover'` shows the rule only on hover. */
		underline?: 'always' | 'hover' | 'none';
		/** Adds `target="_blank" rel="noreferrer"` and an arrow glyph. */
		external?: boolean;
		/** Inherit the surrounding text colour instead of the tone. */
		muted?: boolean;
		/** Leading icon, 14px. */
		icon?: Snippet;
		/** Trailing icon, before the external mark. */
		iconEnd?: Snippet;
		children: Snippet;
	}

	let {
		tone = 'brand',
		underline = 'hover',
		external = false,
		muted = false,
		icon,
		iconEnd,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const underlines = {
		always: 'underline underline-offset-4',
		hover: 'hover:underline underline-offset-4',
		none: ''
	};
</script>

<a
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="inline-flex items-center gap-1 font-sans transition-colors duration-150 ease-brand-out
		{muted ? `text-text-secondary ${toneHoverText[tone]}` : toneText[tone]}
		{underlines[underline]} {focusRing} {toneRing[tone]} {className}"
	{...rest}
>
	{#if icon}<span class={iconSm}>{@render icon()}</span>{/if}
	{@render children()}
	{#if iconEnd}<span class={iconSm}>{@render iconEnd()}</span>{/if}
	{#if external}
		<svg class="size-[0.85em] shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path
				d="M5.5 2.5h6v6M11.5 2.5 3.5 10.5"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span class="sr-only">(opens in a new tab)</span>
	{/if}
</a>
