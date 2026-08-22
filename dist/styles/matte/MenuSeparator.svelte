<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Optional caption, rendered as a section heading above the rule. */
		label?: string;
	}

	let { label, class: className = '', ...rest }: Props = $props();
</script>

{#if label}
	<div
		class="mt-1 px-3 pt-2 pb-1 font-mono text-[10px] tracking-wide text-text-muted uppercase {className}"
		role="presentation"
		{...rest}
	>
		{label}
	</div>
{:else}
	<div role="separator" class="my-1 h-px bg-hairline {className}" {...rest}></div>
{/if}
