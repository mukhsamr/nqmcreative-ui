<script lang="ts">
	import type { Snippet } from 'svelte';
	import { anchored, type Placement } from '../actions/anchor.js';
	import { clickOutside, focusTrap, portal } from '../actions/dismissable.js';

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
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function triggerBehaviour(node: HTMLElement) {
		const toggle = () => (open = !open);
		const show = () => {
			clearTimeout(closeTimer);
			open = true;
		};
		const hide = () => {
			closeTimer = setTimeout(() => (open = false), 120);
		};

		if (on === 'click') {
			node.addEventListener('click', toggle);
		} else {
			node.addEventListener('pointerenter', show);
			node.addEventListener('pointerleave', hide);
			node.addEventListener('focusin', show);
			node.addEventListener('focusout', hide);
		}

		return {
			destroy() {
				clearTimeout(closeTimer);
				node.removeEventListener('click', toggle);
				node.removeEventListener('pointerenter', show);
				node.removeEventListener('pointerleave', hide);
				node.removeEventListener('focusin', show);
				node.removeEventListener('focusout', hide);
			}
		};
	}

	$effect(() => {
		const control = anchorEl?.querySelector('button, a, [role="button"]');
		if (!control) return;
		control.setAttribute('aria-haspopup', 'dialog');
		control.setAttribute('aria-expanded', String(open));
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		event.stopPropagation();
		open = false;
	}
</script>

<span bind:this={anchorEl} use:triggerBehaviour class="inline-flex {triggerClass}">
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
			if (on === 'hover') closeTimer = setTimeout(() => (open = false), 120);
		}}
		role="dialog"
		aria-label={title}
		tabindex="-1"
		class="z-50 flex max-w-xs flex-col gap-2 border border-hairline bg-bg p-4 font-sans {className}"
	>
		{#if title}
			<p class="font-heading text-sm font-medium text-text">{title}</p>
		{/if}
		<div class="text-sm leading-relaxed text-text-secondary">
			{@render children()}
		</div>
	</div>
{/if}
