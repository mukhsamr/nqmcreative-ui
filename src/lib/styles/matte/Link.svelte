<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { focusRing, toneHoverText, toneRing, toneText, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAnchorAttributes {
		tone?: Tone;
		/** `'hover'` shows the rule only on hover. */
		underline?: 'always' | 'hover' | 'none';
		/** Adds `target="_blank" rel="noreferrer"` and an arrow glyph. */
		external?: boolean;
		/** Inherit the surrounding text colour instead of the tone. */
		muted?: boolean;
		children: Snippet;
	}

	let {
		tone = 'brand',
		underline = 'hover',
		external = false,
		muted = false,
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
	rel={external ? 'noreferrer' : undefined}
	class="inline-flex items-center gap-1 font-sans transition-colors duration-150 ease-brand-out
		{muted ? `text-text-secondary ${toneHoverText[tone]}` : toneText[tone]}
		{underlines[underline]} {focusRing} {toneRing[tone]} {className}"
	{...rest}
>
	{@render children()}
	{#if external}<span aria-hidden="true" class="text-[0.85em]">↗</span>{/if}
</a>
