<script lang="ts">
	import type { Snippet } from 'svelte';
	import { anchored } from '../actions/anchor.js';
	import { clickOutside, focusTrap, navigateList, portal } from '../actions/dismissable.js';
	import { useLocale } from '../locale.svelte.js';

	interface Props {
		/** The region that responds to a right-click. */
		children: Snippet;
		/** Menu contents: `MenuItem`, `MenuSeparator`, anything. */
		menu: Snippet;
		open?: boolean;
		label?: string;
		disabled?: boolean;
		class?: string;
		menuClass?: string;
	}

	let {
		children,
		menu,
		open = $bindable(false),
		label,
		disabled = false,
		class: className = '',
		menuClass = ''
	}: Props = $props();

	const t = useLocale();

	let menuEl: HTMLElement | null = $state(null);
	/**
	 * A 0×0 element parked at the pointer, so the same `anchored` action that
	 * positions dropdowns can flip and clamp this menu too.
	 */
	let cursor: HTMLElement | null = $state(null);

	function onContextMenu(event: MouseEvent) {
		if (disabled) return;
		event.preventDefault();
		if (!cursor) {
			cursor = document.createElement('div');
			cursor.style.cssText = 'position:fixed;width:0;height:0;pointer-events:none';
			document.body.appendChild(cursor);
		}
		cursor.style.left = `${event.clientX}px`;
		cursor.style.top = `${event.clientY}px`;
		open = true;
	}

	$effect(() => () => cursor?.remove());

	function onMenuKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'Tab') {
			if (event.key === 'Escape') event.preventDefault();
			event.stopPropagation();
			open = false;
			return;
		}
		if (!menuEl) return;
		navigateList(event, [
			...menuEl.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
		]);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div oncontextmenu={onContextMenu} class={className}>
	{@render children()}
</div>

{#if open}
	<div
		bind:this={menuEl}
		use:portal
		use:anchored={{ anchor: cursor, placement: 'bottom-start', offset: 2 }}
		use:clickOutside={{ onoutside: () => (open = false) }}
		use:focusTrap={{ restore: true }}
		onkeydown={onMenuKeydown}
		onclick={(event) => {
			if ((event.target as HTMLElement).closest('[role="menuitem"]:not([disabled])')) open = false;
		}}
		role="menu"
		aria-label={label ?? t.current.menu}
		tabindex="-1"
		class="z-50 flex max-h-[min(24rem,80vh)] min-w-44 flex-col overflow-y-auto border border-hairline bg-bg py-1 font-sans {menuClass}"
	>
		{@render menu()}
	</div>
{/if}
