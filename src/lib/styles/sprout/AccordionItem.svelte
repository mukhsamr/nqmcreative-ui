<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAttributes<HTMLDetailsElement> {
		title: string;
		open?: boolean;
		tone?: Tone;
		/** Short text on the right of the summary row. */
		meta?: string;
		children: Snippet;
	}

	let {
		title,
		open = $bindable(false),
		tone = 'brand',
		meta,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<details bind:open class="group border-b border-hairline last:border-b-0 {className}" {...rest}>
	<summary
		class="flex cursor-pointer list-none items-center gap-4 px-4 py-3.5 font-sans text-sm font-medium text-text transition-colors duration-150 ease-brand-out select-none hover:bg-bg-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-current [&::-webkit-details-marker]:hidden"
	>
		<span class="flex-1">{title}</span>
		{#if meta}<span class="text-[13px] font-normal text-text-muted">{meta}</span>{/if}
		<svg
			class="size-4 shrink-0 transition-transform duration-200 ease-brand-out group-open:rotate-180 {toneText[
				tone
			]}"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	</summary>
	<div class="px-4 pb-4 font-sans text-sm leading-relaxed text-text-secondary">
		{@render children()}
	</div>
</details>
