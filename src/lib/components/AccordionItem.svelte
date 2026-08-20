<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../tones.js';

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

<details bind:open class="group border-b border-hairline {className}" {...rest}>
	<summary
		class="flex cursor-pointer list-none items-center gap-4 py-4 font-sans text-[15px] text-text transition-colors duration-150 ease-brand-out select-none hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current [&::-webkit-details-marker]:hidden"
	>
		<span class="flex-1 font-medium">{title}</span>
		{#if meta}<span class="font-mono text-xs text-text-muted">{meta}</span>{/if}
		<svg
			class="size-4 shrink-0 transition-transform duration-200 ease-brand-out group-open:rotate-45 {toneText[
				tone
			]}"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" />
		</svg>
	</summary>
	<div class="pb-5 font-sans text-[15px] leading-relaxed text-text-secondary">
		{@render children()}
	</div>
</details>
