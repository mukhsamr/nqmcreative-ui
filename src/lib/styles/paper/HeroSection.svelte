<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Small line above the headline. */
		eyebrow?: string;
		title: string;
		description?: string;
		tone?: Tone;
		/** `center` also centres the actions. Ignored when `media` is set. */
		align?: 'left' | 'center';
		/** Buttons under the copy. */
		actions?: Snippet;
		/** Anything on the right — a screenshot, an illustration, a form. */
		media?: Snippet;
		/** Extra content between the description and the actions. */
		children?: Snippet;
	}

	let {
		eyebrow,
		title,
		description,
		tone = 'brand',
		align = 'left',
		actions,
		media,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A media column only makes sense next to left-aligned copy.
	const centred = $derived(align === 'center' && !media);
</script>

<section class="w-full px-6 py-20 sm:py-28 {className}" {...rest}>
	<div
		class="mx-auto flex w-full max-w-6xl gap-16
			{media ? 'flex-col lg:flex-row lg:items-center' : 'flex-col'}"
	>
		<div
			class="flex min-w-0 flex-1 flex-col gap-6 {centred
				? 'items-center text-center'
				: 'items-start'}"
		>
			{#if eyebrow}
				<span
					class="inline-flex rounded-full px-3 py-1 font-sans text-[13px] font-medium {toneSoft[
						tone
					]}"
				>
					{eyebrow}
				</span>
			{/if}

			<h1
				class="max-w-2xl font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-text sm:text-5xl"
			>
				{title}
			</h1>

			{#if description}
				<p class="max-w-xl font-sans text-lg leading-relaxed text-pretty text-text-secondary">
					{description}
				</p>
			{/if}

			{#if children}
				{@render children()}
			{/if}

			{#if actions}
				<div class="flex flex-wrap items-center gap-3 pt-2 {centred ? 'justify-center' : ''}">
					{@render actions()}
				</div>
			{/if}
		</div>

		{#if media}
			<div class="min-w-0 flex-1">{@render media()}</div>
		{/if}
	</div>
</section>
