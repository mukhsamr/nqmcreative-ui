<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Spinner from './Spinner.svelte';
	import { iconMd, iconSm } from './icon.js';
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

	interface Props extends Omit<HTMLButtonAttributes, 'onclick'> {
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
		/** Leading icon. The spinner takes its place while the button is busy. */
		icon?: Snippet;
		/** Trailing icon. */
		iconEnd?: Snippet;
		/** Square button with no label — pass an `aria-label`. */
		iconOnly?: boolean;
		/**
		 * Return a promise — a save, a submit, a fetch — and the button spins and
		 * locks itself until it settles, without any state in the parent. It
		 * unlocks on a rejection too, so catch failures inside the handler.
		 */
		onclick?: (event: MouseEvent) => unknown;
		children?: Snippet;
	}

	let {
		variant = 'solid',
		tone = 'brand',
		size = 'md',
		href,
		loading = false,
		block = false,
		icon,
		iconEnd,
		iconOnly = false,
		onclick,
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const base =
		// The press: shadow is paper's language, so a click flattens the button
		// onto the page (shadow drops) and dims it a notch. Snaps in at 75ms,
		// settles back over the base 150ms on release.
		'inline-flex items-center justify-center gap-2 rounded-md border font-sans font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,filter] duration-150 ease-brand-out active:shadow-none active:brightness-95 active:duration-75 disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none';

	const sizes: Record<ButtonSize, string> = {
		sm: 'h-8 px-3 text-[13px]',
		md: 'h-10 px-4 text-sm',
		lg: 'h-11 px-5 text-[15px]',
		xl: 'h-12 px-6 text-base'
	};

	const squares: Record<ButtonSize, string> = {
		sm: 'size-8',
		md: 'size-10',
		lg: 'size-11',
		xl: 'size-12'
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

	/** Set by an `onclick` that returned a promise, on top of the `loading` prop. */
	let pending = $state(false);
	const busy = $derived(loading || pending);
	const inert = $derived(disabled || busy);

	const iconClass = $derived(size === 'sm' ? iconSm : iconMd);

	async function handleClick(event: MouseEvent) {
		if (inert) {
			event.preventDefault();
			return;
		}
		const result = onclick?.(event);
		// Anything else is a plain handler: nothing to wait for, nothing to lock.
		if (!(result instanceof Promise)) return;
		pending = true;
		// The handler owns its own errors — catch them there to show a message.
		// All the button needs to know is that the work has settled.
		await result.catch(() => {});
		pending = false;
	}
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	type={href ? undefined : type}
	disabled={href ? undefined : inert}
	aria-disabled={href && inert ? 'true' : undefined}
	aria-busy={busy ? 'true' : undefined}
	tabindex={href && inert ? -1 : undefined}
	class="{base} {focusRing} {toneRing[tone]} {variantClass} {isLink
		? ''
		: iconOnly
			? squares[size]
			: sizes[size]}
		{block ? 'w-full' : ''} {className}"
	{...rest}
	onclick={handleClick}
>
	{#if busy}
		<Spinner size={size === 'sm' ? 'xs' : 'sm'} label="" />
	{:else if icon}
		<span class={iconClass} aria-hidden="true">{@render icon()}</span>
	{/if}
	{@render children?.()}
	{#if iconEnd && !iconOnly}
		<span class={iconClass} aria-hidden="true">{@render iconEnd()}</span>
	{/if}
</svelte:element>
