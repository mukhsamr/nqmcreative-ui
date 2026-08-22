<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { useLocale } from '../../core/locale.svelte.js';
	import { isBackdropClick, syncDialog } from '../../core/dialog.svelte.js';

	export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
	export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

	interface Props extends HTMLDialogAttributes {
		/** Bindable. Built on the native `<dialog>`, so it gets the top layer,
		 *  the backdrop, Escape handling and focus containment for free. */
		open?: boolean;
		side?: DrawerSide;
		size?: DrawerSize;
		title?: string;
		description?: string;
		dismissible?: boolean;
		footer?: Snippet;
		onclose?: () => void;
		children: Snippet;
	}

	let {
		open = $bindable(false),
		side = 'right',
		size = 'md',
		title,
		description,
		dismissible = true,
		footer,
		onclose,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const t = useLocale();
	let dialog: HTMLDialogElement | null = $state(null);

	const horizontal = $derived(side === 'left' || side === 'right');

	const widths: Record<DrawerSize, string> = {
		sm: 'w-[min(20rem,100vw)]',
		md: 'w-[min(28rem,100vw)]',
		lg: 'w-[min(40rem,100vw)]',
		full: 'w-screen'
	};

	const heights: Record<DrawerSize, string> = {
		sm: 'h-[min(16rem,100vh)]',
		md: 'h-[min(24rem,100vh)]',
		lg: 'h-[min(36rem,100vh)]',
		full: 'h-screen'
	};

	const sides: Record<DrawerSide, string> = {
		left: 'mr-auto ml-0 h-screen max-h-screen border-r',
		right: 'mr-0 ml-auto h-screen max-h-screen border-l',
		top: 'mt-0 mb-auto w-screen max-w-screen border-b',
		bottom: 'mt-auto mb-0 w-screen max-w-screen border-t'
	};

	const slide: Record<DrawerSide, string> = {
		left: 'animate-[drawer-left_220ms_cubic-bezier(0.16,1,0.3,1)]',
		right: 'animate-[drawer-right_220ms_cubic-bezier(0.16,1,0.3,1)]',
		top: 'animate-[drawer-top_220ms_cubic-bezier(0.16,1,0.3,1)]',
		bottom: 'animate-[drawer-bottom_220ms_cubic-bezier(0.16,1,0.3,1)]'
	};

	$effect(() => syncDialog(dialog, open));

	function close() {
		open = false;
		onclose?.();
	}
</script>

<dialog
	bind:this={dialog}
	onclose={close}
	onclick={(event) => {
		if (dismissible && isBackdropClick(event, dialog)) close();
	}}
	oncancel={(event) => {
		if (!dismissible) event.preventDefault();
	}}
	class="max-h-none max-w-none border-hairline bg-bg p-0 text-text backdrop:bg-text/40
		{sides[side]} {horizontal ? widths[size] : heights[size]} {slide[side]} {className}"
	{...rest}
>
	<div class="flex h-full flex-col">
		{#if title || dismissible}
			<div class="flex items-start gap-4 border-b border-hairline px-6 py-5">
				<div class="flex min-w-0 flex-1 flex-col gap-1">
					{#if title}
						<h2 class="font-heading text-lg font-medium tracking-tight">{title}</h2>
					{/if}
					{#if description}
						<p class="font-sans text-sm text-text-secondary">{description}</p>
					{/if}
				</div>
				{#if dismissible}
					<button
						type="button"
						onclick={close}
						aria-label={t.current.close}
						class="-m-1 shrink-0 p-1 text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
					>
						<svg class="size-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
						</svg>
					</button>
				{/if}
			</div>
		{/if}

		<div
			class="flex-1 overflow-y-auto px-6 py-5 font-sans text-[15px] leading-relaxed text-text-secondary"
		>
			{@render children()}
		</div>

		{#if footer}
			<div class="flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>

<style>
	@keyframes -global-drawer-right {
		from {
			transform: translateX(100%);
		}
	}
	@keyframes -global-drawer-left {
		from {
			transform: translateX(-100%);
		}
	}
	@keyframes -global-drawer-top {
		from {
			transform: translateY(-100%);
		}
	}
	@keyframes -global-drawer-bottom {
		from {
			transform: translateY(100%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		dialog {
			animation: none;
		}
	}
</style>
