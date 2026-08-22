<script lang="ts">
	import type { Snippet } from 'svelte';
	import { anchored, type Placement } from '../../core/actions/anchor.js';
	import { clickOutside, focusTrap, portal } from '../../core/actions/dismissable.js';
	import { HOVER_GRACE, describeTrigger, popupTrigger } from '../../core/trigger.js';

	interface Props {
		trigger: Snippet;
		children: Snippet;
		open?: boolean;
		placement?: Placement;
		offset?: number;
		title?: string;
		/** `'hover'` also opens on focus, for read-only content. */
		on?: 'click' | 'hover';
		/** Keep focus where it is — right for hover popovers and hover cards. */
		trapFocus?: boolean;
		class?: string;
		triggerClass?: string;
	}

	let {
		trigger,
		children,
		open = $bindable(false),
		placement = 'bottom',
		offset = 8,
		title,
		on = 'click',
		trapFocus = true,
		class: className = '',
		triggerClass = ''
	}: Props = $props();

	let anchorEl: HTMLElement | null = $state(null);
	/** Held so the panel itself can cancel the hover close it inherited. */
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => describeTrigger(anchorEl, 'dialog', open));

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		event.stopPropagation();
		open = false;
	}
</script>

<span
	bind:this={anchorEl}
	use:popupTrigger={{
		toggle: () => (open = !open),
		open: () => (open = true),
		close: () => (open = false),
		on
	}}
	class="inline-flex {triggerClass}"
>
	{@render trigger()}
</span>

{#if open}
	<div
		use:portal
		use:anchored={{ anchor: anchorEl, placement, offset }}
		use:clickOutside={{
			onoutside: () => (open = false),
			ignore: [anchorEl],
			enabled: on === 'click'
		}}
		use:focusTrap={{ enabled: trapFocus, autofocus: trapFocus, restore: trapFocus }}
		onkeydown={onKeydown}
		onpointerenter={() => clearTimeout(closeTimer)}
		onpointerleave={() => {
			if (on === 'hover') closeTimer = setTimeout(() => (open = false), HOVER_GRACE);
		}}
		role="dialog"
		aria-label={title}
		tabindex="-1"
		class="z-50 flex max-w-xs flex-col gap-2 rounded-lg border border-hairline bg-bg p-4 font-sans shadow-lg {className}"
	>
		{#if title}
			<p class="font-heading text-sm font-semibold text-text">{title}</p>
		{/if}
		<div class="text-[13px] leading-relaxed text-text-secondary">
			{@render children()}
		</div>
	</div>
{/if}
