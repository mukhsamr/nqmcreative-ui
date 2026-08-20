<script module lang="ts">
	export interface FooterLink {
		label: string;
		href?: string;
		external?: boolean;
	}

	export interface FooterColumn {
		title: string;
		links: FooterLink[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toneHoverText, type Tone } from '../tones.js';

	interface Props {
		columns?: FooterColumn[];
		/** Logo, wordmark and a line of copy on the left. */
		brand?: Snippet;
		/** Right side of the bottom bar — social links, a locale picker. */
		bottom?: Snippet;
		/** Left side of the bottom bar. Ignored when `bottom` covers both. */
		copyright?: string;
		tone?: Tone;
		class?: string;
	}

	let {
		columns = [],
		brand,
		bottom,
		copyright,
		tone = 'brand',
		class: className = ''
	}: Props = $props();
</script>

<footer class="w-full border-t border-hairline bg-bg {className}">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14">
		{#if brand || columns.length}
			<div class="flex flex-col gap-10 md:flex-row md:justify-between">
				{#if brand}
					<div class="flex max-w-xs flex-col gap-3">{@render brand()}</div>
				{/if}

				{#if columns.length}
					<div class="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
						{#each columns as column (column.title)}
							<div class="flex flex-col gap-3">
								<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">
									{column.title}
								</p>
								<ul class="flex flex-col gap-2">
									{#each column.links as item (item.label)}
										<li>
											<a
												href={item.href}
												target={item.external ? '_blank' : undefined}
												rel={item.external ? 'noreferrer' : undefined}
												class="font-sans text-sm text-text-secondary transition-colors duration-150 ease-brand-out {toneHoverText[
													tone
												]}"
											>
												{item.label}
												{#if item.external}<span aria-hidden="true" class="text-[0.85em]">↗</span
													>{/if}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if copyright || bottom}
			<div
				class="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between"
			>
				{#if copyright}
					<p class="font-mono text-xs text-text-muted">{copyright}</p>
				{/if}
				{#if bottom}
					<div class="flex items-center gap-4">{@render bottom()}</div>
				{/if}
			</div>
		{/if}
	</div>
</footer>
