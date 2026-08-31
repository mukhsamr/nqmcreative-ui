<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { edge } from './lift.js';
	import type { InputSize } from './Input.svelte';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Match the Input it sits beside — the heights have to agree. */
		size?: InputSize;
		/** Paint it like a field instead of a fixed label. */
		variant?: 'muted' | 'plain';
		children: Snippet;
	}

	let {
		size = 'md',
		variant = 'muted',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const sizes: Record<InputSize, string> = {
		sm: 'h-8 px-2.5 text-[13px]',
		md: 'h-10 px-3 text-sm',
		lg: 'h-11 px-3 text-[15px]'
	};
</script>

<span
	class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-hairline-strong font-sans whitespace-nowrap text-text-secondary {edge}
		{sizes[size]}
		{variant === 'muted' ? 'bg-bg-alt' : 'bg-bg'} {className}"
	{...rest}
>
	{@render children()}
</span>
