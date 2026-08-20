<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<div class="flex flex-col border-t border-hairline {className}" {...rest}>
	{@render children()}
</div>
