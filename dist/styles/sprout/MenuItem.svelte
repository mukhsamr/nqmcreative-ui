<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { toneSoftHover, toneText, type Tone } from '../../core/tones.js';
	import { iconMd } from './icon.js';

	interface Props extends HTMLButtonAttributes {
		/** Renders an `<a>` instead of a `<button>`. */
		href?: string;
		tone?: Tone;
		/** Leading glyph. */
		icon?: Snippet;
		/** Right-aligned hint — a keyboard shortcut, a count. */
		shortcut?: string;
		/** Shows a check on the left and marks the item as chosen. */
		selected?: boolean;
		children: Snippet;
	}

	let {
		href,
		tone = 'neutral',
		icon,
		shortcut,
		selected = false,
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	type={href ? undefined : 'button'}
	role="menuitem"
	disabled={href ? undefined : disabled}
	aria-disabled={disabled ? 'true' : undefined}
	tabindex={disabled ? undefined : -1}
	class="mx-1 flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors duration-100 ease-brand-out focus:outline-none disabled:pointer-events-none disabled:opacity-40
		{tone === 'neutral'
		? 'text-text-secondary hover:bg-bg-inset focus-visible:bg-bg-inset'
		: `${toneText[tone]} ${toneSoftHover[tone]}`}
		{className}"
	{...rest}
>
	{#if selected}
		<svg class="size-3.5 shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path
				d="m2 7 3.2 3.2L12 3.6"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if icon}
		<span class={iconMd}>{@render icon()}</span>
	{/if}
	<span class="min-w-0 flex-1 truncate">{@render children()}</span>
	{#if shortcut}
		<span class="shrink-0 text-[11px] text-text-muted">{shortcut}</span>
	{/if}
</svelte:element>
