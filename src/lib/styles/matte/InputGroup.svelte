<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Children sit flush against each other with shared hairlines —
		 *  an Input plus a Button, a Select plus an Input, and so on. */
		children: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<div
	class="flex w-full items-stretch [&>*]:min-w-0 [&>*]:rounded-none [&>*:focus-within]:relative [&>*:focus-within]:z-10 [&>*:not(:first-child)]:-ml-px {className}"
	{...rest}
>
	{@render children()}
</div>
