<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		children: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<kbd
	class="inline-flex h-6 min-w-6 items-center justify-center border border-b-2 border-hairline-strong bg-bg-alt px-1.5 font-mono text-[11px] text-text-secondary {className}"
	{...rest}
>
	{@render children()}
</kbd>
