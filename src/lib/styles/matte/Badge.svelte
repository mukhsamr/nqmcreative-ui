<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		toneBorderSoft,
		toneFill,
		toneSoft,
		toneSolid,
		toneText,
		type Tone
	} from '../../core/tones.js';
	import { iconSm } from './icon.js';

	export type BadgeVariant = 'soft' | 'solid' | 'outline';
	export type BadgeSize = 'sm' | 'md';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		tone?: Tone;
		variant?: BadgeVariant;
		size?: BadgeSize;
		/** Small filled circle before the label. */
		dot?: boolean;
		/** Leading icon, 14px — sits where the dot would. */
		icon?: Snippet;
		children: Snippet;
	}

	let {
		tone = 'brand',
		variant = 'soft',
		size = 'md',
		dot = false,
		icon,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<BadgeVariant, string> = $derived({
		soft: toneSoft[tone],
		solid: toneSolid[tone],
		outline: `border ${toneBorderSoft[tone]} ${toneText[tone]} bg-bg`
	});

	const sizes: Record<BadgeSize, string> = {
		sm: 'px-2.5 py-0.5 text-[10px]',
		md: 'px-3 py-1 text-xs'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide
		{variants[variant]} {sizes[size]} {className}"
	{...rest}
>
	{#if dot}
		<span
			class="size-1.5 shrink-0 rounded-full {variant === 'solid' ? 'bg-current' : toneFill[tone]}"
		></span>
	{/if}
	{#if icon}<span class={iconSm}>{@render icon()}</span>{/if}
	{@render children()}
</span>
