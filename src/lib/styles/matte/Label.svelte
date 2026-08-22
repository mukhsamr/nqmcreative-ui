<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	interface Props extends HTMLLabelAttributes {
		required?: boolean;
		children: Snippet;
	}

	let { required = false, class: className = '', children, ...rest }: Props = $props();
</script>

<label class="font-sans text-sm font-medium text-text {className}" {...rest}>
	{@render children()}
	{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}
</label>
