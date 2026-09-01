<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type SkeletonVariant = 'text' | 'block' | 'circle';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: SkeletonVariant;
		/** `text` only — number of stacked lines, the last one runs short. */
		lines?: number;
		/** Any CSS length, e.g. `'12rem'` or `'60%'`. */
		width?: string;
		height?: string;
	}

	let {
		variant = 'text',
		lines = 1,
		width,
		height,
		class: className = '',
		...rest
	}: Props = $props();

	const variants: Record<SkeletonVariant, string> = {
		text: 'h-4 w-full',
		block: 'h-24 w-full',
		circle: 'size-10 rounded-full'
	};
</script>

{#if variant === 'text' && lines > 1}
	<div aria-hidden="true" class="flex w-full flex-col gap-2 {className}" {...rest}>
		{#each { length: lines }, i (i)}
			<div
				class="h-4 animate-pulse bg-bg-inset {i === lines - 1 ? 'w-2/3' : 'w-full'}"
				style={width && i !== lines - 1 ? `width:${width}` : undefined}
			></div>
		{/each}
	</div>
{:else}
	<div
		aria-hidden="true"
		class="animate-pulse bg-bg-inset {variants[variant]} {className}"
		style="{width ? `width:${width};` : ''}{height ? `height:${height};` : ''}"
		{...rest}
	></div>
{/if}
