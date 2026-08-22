<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Tooltip text. CSS-only: shows on hover and on keyboard focus. */
		content: string;
		placement?: TooltipPlacement;
		children: Snippet;
	}

	let { content, placement = 'top', class: className = '', children, ...rest }: Props = $props();

	const placements: Record<TooltipPlacement, string> = {
		top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
		bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2',
		left: 'right-full top-1/2 mr-1.5 -translate-y-1/2',
		right: 'left-full top-1/2 ml-1.5 -translate-y-1/2'
	};
</script>

<span class="group/tt relative inline-flex" {...rest}>
	{@render children()}
	<span
		role="tooltip"
		class="pointer-events-none invisible absolute z-50 rounded-md bg-text px-2 py-1 font-sans text-xs font-medium whitespace-nowrap text-text-inverse opacity-0 shadow-lg transition-opacity duration-150 ease-brand-out group-focus-within/tt:visible group-focus-within/tt:opacity-100 group-hover/tt:visible group-hover/tt:opacity-100
			{placements[placement]} {className}"
	>
		{content}
	</span>
</span>
