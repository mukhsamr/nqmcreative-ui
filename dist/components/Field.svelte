<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		/** Helper text under the control. Hidden while `error` is set. */
		hint?: string;
		/** Replaces the hint and turns it red. */
		error?: string;
		required?: boolean;
		/** `id` of the control — set the same value on the input inside. */
		for?: string;
		children: Snippet;
	}

	let {
		label,
		hint,
		error,
		required = false,
		for: htmlFor,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<div class="flex w-full flex-col gap-2 {className}" {...rest}>
	{#if label}
		<label for={htmlFor} class="font-sans text-sm font-medium text-text">
			{label}
			{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if error}
		<p class="font-sans text-sm text-danger">{error}</p>
	{:else if hint}
		<p class="font-sans text-sm text-text-muted">{hint}</p>
	{/if}
</div>
