<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../../core/tones.js';

	export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		src?: string;
		alt?: string;
		/** Falls back to the initials of this name when there is no `src`. */
		name?: string;
		size?: AvatarSize;
		tone?: Tone;
		/** Rounded square instead of the default circle. */
		squared?: boolean;
		/** Drawn instead of the initials when there is no `src` — a user mark. */
		fallback?: Snippet;
	}

	let {
		src,
		alt,
		name = '',
		size = 'md',
		tone = 'brand',
		squared = false,
		fallback,
		class: className = '',
		...rest
	}: Props = $props();

	const sizes: Record<AvatarSize, string> = {
		xs: 'size-6 text-[10px]',
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg'
	};

	// The mark tracks the initials: about half the circle, whatever the size.
	const glyphs: Record<AvatarSize, string> = {
		xs: 'grid place-items-center *:size-3',
		sm: 'grid place-items-center *:size-4',
		md: 'grid place-items-center *:size-5',
		lg: 'grid place-items-center *:size-6',
		xl: 'grid place-items-center *:size-8'
	};

	const initials = $derived(
		name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0] ?? '')
			.join('')
			.toUpperCase()
	);
</script>

<span
	class="inline-flex shrink-0 items-center justify-center overflow-hidden font-sans font-semibold select-none
		{squared ? 'rounded-lg' : 'rounded-full'} {sizes[size]} {src
		? 'bg-bg-inset'
		: toneSoft[tone]} {className}"
	{...rest}
>
	{#if src}
		<img {src} alt={alt ?? name} class="size-full object-cover" />
	{:else if fallback}
		<span class={glyphs[size]}>{@render fallback()}</span>
	{:else}
		{initials}
	{/if}
</span>
