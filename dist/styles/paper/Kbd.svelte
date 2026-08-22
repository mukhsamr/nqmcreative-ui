<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		children: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<kbd
	class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-hairline bg-bg-alt px-1.5 font-sans text-[11px] font-medium text-text-secondary shadow-xs {className}"
	{...rest}
>
	{@render children()}
</kbd>
