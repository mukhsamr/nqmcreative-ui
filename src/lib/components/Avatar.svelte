<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../tones.js';

	export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		src?: string;
		alt?: string;
		/** Falls back to the initials of this name when there is no `src`. */
		name?: string;
		size?: AvatarSize;
		tone?: Tone;
		/** Square instead of the default circle. */
		squared?: boolean;
	}

	let {
		src,
		alt,
		name = '',
		size = 'md',
		tone = 'brand',
		squared = false,
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
	class="inline-flex shrink-0 items-center justify-center overflow-hidden font-mono font-medium select-none
		{squared ? '' : 'rounded-full'} {sizes[size]} {src ? 'bg-bg-inset' : toneSoft[tone]} {className}"
	{...rest}
>
	{#if src}
		<img {src} alt={alt ?? name} class="size-full object-cover" />
	{:else}
		{initials}
	{/if}
</span>
