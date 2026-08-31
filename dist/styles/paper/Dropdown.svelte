<script lang="ts">
	import type { Snippet } from 'svelte';
	import { anchored, type Placement } from '../../core/actions/anchor.js';
	import { clickOutside, focusTrap, navigateList, portal } from '../../core/actions/dismissable.js';
	import { describeTrigger, menuItems, popupTrigger } from '../../core/trigger.js';

	interface Props {
		/** The control that opens the menu — put a `Button` in here. */
		trigger: Snippet;
		/** Menu contents: `MenuItem`, `MenuSeparator`, or anything else. */
		children: Snippet;
		open?: boolean;
		placement?: Placement;
		offset?: number;
		/** Stretch the menu to the trigger's width. */
		matchWidth?: boolean;
		/** Close as soon as an item inside is activated. Default true. */
		closeOnSelect?: boolean;
		/** Accessible name for the menu. Defaults to `Menu`. */
		label?: string;
		class?: string;
		/** Classes for the wrapper around the trigger. */
		triggerClass?: string;
	}

	let {
		trigger,
		children,
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 6,
		matchWidth = false,
		closeOnSelect = true,
		label,
		class: className = '',
		triggerClass = ''
	}: Props = $props();

	let anchorEl: HTMLElement | null = $state(null);
	let menuEl: HTMLElement | null = $state(null);

	// The ARIA state goes on the consumer's own control, not on our wrapper.
	$effect(() => describeTrigger(anchorEl, 'menu', open));

	function onMenuKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'Tab') {
			if (event.key === 'Escape') event.preventDefault();
			event.stopPropagation();
			open = false;
			return;
		}
		navigateList(event, menuItems(menuEl));
	}

	function onMenuClick(event: MouseEvent) {
		if (!closeOnSelect) return;
		if ((event.target as HTMLElement).closest('[role="menuitem"]:not([disabled])')) open = false;
	}
</script>

<span
	bind:this={anchorEl}
	use:popupTrigger={{
		toggle: () => (open = !open),
		open: () => (open = true),
		close: () => (open = false),
		arrowOpens: true,
		isOpen: () => open
	}}
	class="inline-flex {triggerClass}"
>
	{@render trigger()}
</span>

{#if open}
	<div
		bind:this={menuEl}
		use:portal
		use:anchored={{ anchor: anchorEl, placement, offset, matchWidth }}
		use:clickOutside={{ onoutside: () => (open = false), ignore: [anchorEl] }}
		use:focusTrap={{ restore: true }}
		onkeydown={onMenuKeydown}
		onclick={onMenuClick}
		role="menu"
		aria-label={label ?? 'Menu'}
		tabindex="-1"
		class="z-50 flex max-h-[min(24rem,80vh)] min-w-48 flex-col overflow-y-auto rounded-lg border border-hairline bg-bg py-1 font-sans shadow-lg {className}"
	>
		{@render children()}
	</div>
{/if}
