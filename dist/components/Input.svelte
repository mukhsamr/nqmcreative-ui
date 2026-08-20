<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { toneFocusWithinBorder, type Tone } from '../tones.js';

	export type InputSize = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix'> {
		value?: string;
		size?: InputSize;
		tone?: Tone;
		/** Paints the field red and sets `aria-invalid`. */
		invalid?: boolean;
		/** Leading adornment — an icon, a currency symbol, `https://` … */
		prefix?: Snippet;
		/** Trailing adornment. */
		suffix?: Snippet;
	}

	let {
		value = $bindable(''),
		size = 'md',
		tone = 'brand',
		invalid = false,
		disabled = false,
		prefix,
		suffix,
		class: className = '',
		...rest
	}: Props = $props();

	const sizes: Record<InputSize, string> = {
		sm: 'h-9 text-[13px]',
		md: 'h-11 text-[15px]',
		lg: 'h-12 text-base'
	};
</script>

<span
	class="inline-flex w-full items-center gap-2 border bg-bg px-4 transition-colors duration-150 ease-brand-out
		{sizes[size]}
		{invalid
		? 'border-danger focus-within:border-danger'
		: `border-hairline ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	{#if prefix}
		<span class="shrink-0 text-text-muted">{@render prefix()}</span>
	{/if}
	<input
		bind:value
		{disabled}
		aria-invalid={invalid ? 'true' : undefined}
		class="w-full min-w-0 bg-transparent font-sans text-text placeholder:text-text-muted focus:outline-none"
		{...rest}
	/>
	{#if suffix}
		<span class="shrink-0 text-text-muted">{@render suffix()}</span>
	{/if}
</span>
