<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { focusRing, toneHoverText, toneRing, toneSolid, type Tone } from '../../core/tones.js';
	import { liftSm, softOnHover } from './lift.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		tone?: Tone;
		/** Turns the whole card into a link. */
		href?: string;
		/** Glyph inside the tinted square. */
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		tone = 'brand',
		href,
		icon,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="group flex flex-col gap-3 rounded-[28px] bg-bg p-6 {href
		? `transition-[box-shadow,transform] duration-150 ease-brand-out hover:-translate-y-0.5 ${softOnHover} ${focusRing} ${toneRing[tone]}`
		: ''} {className}"
	{...rest}
>
	{#if icon}
		<span
			class="flex size-10 items-center justify-center rounded-xl {toneSolid[tone]} {liftSm[tone]}"
		>
			{@render icon()}
		</span>
	{/if}

	<h3
		class="font-heading text-base font-semibold text-text {href
			? `transition-colors duration-150 ${toneHoverText[tone]}`
			: ''}"
	>
		{title}
	</h3>

	{#if description}
		<p class="font-sans text-sm leading-relaxed text-text-secondary">{description}</p>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</svelte:element>
