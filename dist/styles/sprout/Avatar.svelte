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

	// A src that 404s left the reader with the browser's broken-image mark while
	// the initials sat right there unused. Holding the failed URL rather than a
	// flag means a new src is tried again on its own.
	let failed = $state('');
	const broken = $derived(failed !== '' && failed === src);

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
		{squared ? 'rounded-2xl' : 'rounded-full'} {sizes[size]} {src && !broken
		? 'bg-bg-inset'
		: toneSoft[tone]} {className}"
	{...rest}
>
	{#if src && !broken}
		<img
			{src}
			alt={alt ?? name}
			onerror={() => (failed = src ?? '')}
			class="size-full object-cover"
		/>
	{:else if fallback}
		<span class={glyphs[size]}>{@render fallback()}</span>
	{:else}
		{initials}
	{/if}
</span>
