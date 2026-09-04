<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';
	import { iconMd } from './icon.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		open?: boolean;
		tone?: Tone;
		/** Short text on the right of the summary row. */
		meta?: string;
		/** Leading icon on the summary row. */
		icon?: Snippet;
		children: Snippet;
	}

	let {
		title,
		open = $bindable(false),
		tone = 'brand',
		meta,
		icon,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
</script>

<!--
	A disclosure, not a native <details>: the panel is a grid whose single row
	animates from 0fr to 1fr, which is the one height animation that works in
	every browser (auto-height keyframes don't interpolate). The <button> keeps
	the keyboard and focus behaviour <summary> gave us for free; aria-expanded
	and the region wiring replace what the open attribute carried.
-->
<div class="border-b border-hairline last:border-b-0 {className}" {...rest}>
	<button
		type="button"
		id="{uid}-trigger"
		aria-expanded={open}
		aria-controls="{uid}-panel"
		onclick={() => (open = !open)}
		class="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left font-sans text-sm font-medium text-text transition-colors duration-150 ease-brand-out select-none hover:bg-bg-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-current"
	>
		{#if icon}<span class={iconMd}>{@render icon()}</span>{/if}
		<span class="flex-1">{title}</span>
		{#if meta}<span class="text-[13px] font-normal text-text-muted">{meta}</span>{/if}
		<svg
			class="size-4 shrink-0 transition-transform duration-200 ease-brand-out {open
				? 'rotate-180'
				: ''} {toneText[tone]}"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	</button>
	<div
		id="{uid}-panel"
		role="region"
		aria-labelledby="{uid}-trigger"
		inert={!open}
		class="grid transition-[grid-template-rows] duration-200 ease-brand-out"
		style:grid-template-rows={open ? '1fr' : '0fr'}
	>
		<!-- overflow-hidden gives this grid row a min height of 0 so 0fr can
			 collapse it fully, and clips the content while it slides. -->
		<div class="overflow-hidden">
			<div class="px-4 pb-4 font-sans text-sm leading-relaxed text-text-secondary">
				{@render children()}
			</div>
		</div>
	</div>
</div>
