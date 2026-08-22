<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<div
	class="flex items-center *:-ml-2 *:ring-2 *:ring-bg [&>*:first-child]:ml-0 {className}"
	{...rest}
>
	{@render children()}
</div>
