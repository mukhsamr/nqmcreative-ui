<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Spinner from './Spinner.svelte';
	import {
		focusRing,
		toneBorderSoft,
		toneRing,
		toneSoft,
		toneSoftHover,
		toneSolid,
		toneSolidHover,
		toneText,
		type Tone
	} from '../../core/tones.js';

	export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'primary';
	export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends HTMLButtonAttributes {
		variant?: ButtonVariant;
		tone?: Tone;
		size?: ButtonSize;
		/** Renders an `<a>` instead of a `<button>`. */
		href?: string;
		target?: string;
		rel?: string;
		loading?: boolean;
		/** Stretch to the container's full width. */
		block?: boolean;
		children: Snippet;
	}

	let {
		variant = 'solid',
		tone = 'brand',
		size = 'md',
		href,
		loading = false,
		block = false,
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-md border font-sans font-medium whitespace-nowrap transition-colors duration-150 ease-brand-out disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none';

	const sizes: Record<ButtonSize, string> = {
		sm: 'h-8 px-3 text-[13px]',
		md: 'h-10 px-4 text-sm',
		lg: 'h-11 px-5 text-[15px]',
		xl: 'h-12 px-6 text-base'
	};

	const variantClass = $derived.by(() => {
		switch (variant) {
			case 'primary':
			case 'solid':
				return `border-transparent shadow-xs ${toneSolid[tone]} ${toneSolidHover[tone]}`;
			case 'soft':
				return `border-transparent ${toneSoft[tone]} ${toneSoftHover[tone]}`;
			// Outline keeps its own colours on hover here — swapping to a solid
			// fill is matte's move, and it fights paper's quieter surfaces.
			case 'outline':
				return `bg-bg shadow-xs ${toneText[tone]} ${toneBorderSoft[tone]} hover:bg-bg-alt`;
			case 'ghost':
				return `border-transparent bg-transparent ${toneText[tone]} ${toneSoftHover[tone]}`;
			case 'link':
				return `border-transparent ${toneText[tone]} h-auto p-0 text-sm underline-offset-4 hover:underline`;
		}
	});

	const isLink = $derived(variant === 'link');
	const inert = $derived(disabled || loading);
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	type={href ? undefined : type}
	disabled={href ? undefined : inert}
	aria-disabled={href && inert ? 'true' : undefined}
	aria-busy={loading ? 'true' : undefined}
	role={href ? 'button' : undefined}
	class="{base} {focusRing} {toneRing[tone]} {variantClass} {isLink ? '' : sizes[size]}
		{block ? 'w-full' : ''} {className}"
	{...rest}
>
	{#if loading}
		<Spinner size={size === 'sm' ? 'xs' : 'sm'} label="" />
	{/if}
	{@render children()}
</svelte:element>
