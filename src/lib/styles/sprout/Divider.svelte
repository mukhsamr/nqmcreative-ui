<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type DividerOrientation = 'horizontal' | 'vertical';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: DividerOrientation;
		/** Centred caption drawn over a horizontal rule. */
		label?: string;
	}

	let { orientation = 'horizontal', label, class: className = '', ...rest }: Props = $props();
</script>

{#if orientation === 'vertical'}
	<div
		role="separator"
		aria-orientation="vertical"
		class="w-px self-stretch bg-hairline {className}"
		{...rest}
	></div>
{:else if label}
	<div role="separator" class="flex items-center gap-3 {className}" {...rest}>
		<span class="h-px flex-1 bg-hairline"></span>
		<span class="font-sans text-xs font-medium text-text-muted">{label}</span>
		<span class="h-px flex-1 bg-hairline"></span>
	</div>
{:else}
	<div role="separator" class="h-px w-full bg-hairline {className}" {...rest}></div>
{/if}
