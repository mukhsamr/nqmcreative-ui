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
	import { edge, lift } from './lift.js';

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

	// Fully round, in the heading face, and standing on a solid lip it sinks
	// into when pressed: the three things that make a sprout button read as
	// something to touch rather than something to click. The 3px it travels is
	// exactly what the lip loses, so the top face lands where the shadow was.
	const base =
		'inline-flex items-center justify-center gap-2 rounded-full border font-heading font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-brand-out active:translate-y-[3px] disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0 aria-disabled:opacity-50 aria-disabled:pointer-events-none';

	// Roomier than the other styles' — a pill needs horizontal padding to keep its label
	// off the curve, and the extra width suits a touch target.
	const sizes: Record<ButtonSize, string> = {
		sm: 'h-9 px-4 text-[13px]',
		md: 'h-11 px-5 text-sm',
		lg: 'h-12 px-6 text-[15px]',
		xl: 'h-14 px-8 text-base'
	};

	const variantClass = $derived.by(() => {
		switch (variant) {
			case 'primary':
			case 'solid':
				return `border-transparent ${toneSolid[tone]} ${toneSolidHover[tone]} ${lift[tone]}`;
			case 'soft':
				return `border-transparent ${toneSoft[tone]} ${toneSoftHover[tone]} ${edge}`;
			// Outline keeps its own colours on hover — swapping to a solid fill is
			// matte's move, and it fights sprout's soft surfaces.
			case 'outline':
				return `bg-bg ${edge} ${toneText[tone]} ${toneBorderSoft[tone]} hover:bg-bg-alt`;
			// Nothing raised, so nothing to sink: ghost stays flat on the page.
			case 'ghost':
				return `border-transparent bg-transparent ${toneText[tone]} ${toneSoftHover[tone]} active:translate-y-0`;
			// No pill and no dip: this variant is a sentence, not a target.
			case 'link':
				return `border-transparent ${toneText[tone]} h-auto p-0 text-sm underline-offset-4 hover:underline active:translate-y-0`;
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
