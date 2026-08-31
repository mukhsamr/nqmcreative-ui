<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		toneBorder,
		toneBorderSoft,
		toneSurface,
		toneText,
		type Tone
	} from '../../core/tones.js';

	export type AlertVariant = 'soft' | 'outline' | 'accent';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: Tone;
		variant?: AlertVariant;
		title?: string;
		/** Shows a close button and fires `ondismiss`. */
		dismissible?: boolean;
		ondismiss?: () => void;
		/** Replaces the built-in status glyph. */
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		tone = 'info',
		variant = 'soft',
		title,
		dismissible = false,
		ondismiss,
		icon,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	let open = $state(true);

	const variants = $derived({
		soft: `${toneSurface[tone]} border ${toneBorderSoft[tone]}`,
		outline: `bg-bg border ${toneBorderSoft[tone]}`,
		accent: `${toneSurface[tone]} border-l-2 ${toneBorder[tone]}`
	});

	function dismiss() {
		open = false;
		ondismiss?.();
	}
</script>

{#if open}
	<div
		role={tone === 'danger' ? 'alert' : 'status'}
		class="flex items-start gap-3 p-4 font-sans {variants[variant]} {className}"
		{...rest}
	>
		<span class="mt-0.5 shrink-0 {toneText[tone]}">
			{#if icon}
				{@render icon()}
			{:else}
				<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
					<path d="M8 4.5v4.5" stroke="currentColor" stroke-width="1.5" />
					<circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
				</svg>
			{/if}
		</span>

		<div class="flex min-w-0 flex-1 flex-col gap-1">
			{#if title}
				<p class="text-[15px] leading-snug font-medium {toneText[tone]}">{title}</p>
			{/if}
			{#if children}
				<div class="text-sm leading-relaxed text-text-secondary">{@render children()}</div>
			{/if}
		</div>

		{#if dismissible}
			<button
				type="button"
				onclick={dismiss}
				aria-label="Dismiss"
				class="-m-1 shrink-0 p-1 text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
			>
				<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</button>
		{/if}
	</div>
{/if}
