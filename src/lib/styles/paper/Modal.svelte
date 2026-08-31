<script lang="ts">
	import type { Snippet } from 'svelte';
	import { iconLg } from './icon.js';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { isBackdropClick, syncDialog } from '../../core/dialog.svelte.js';

	export type ModalSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLDialogAttributes {
		/** Bindable. Uses the native `<dialog>` top layer + backdrop. */
		open?: boolean;
		title?: string;
		description?: string;
		/** Leading icon beside the title. */
		icon?: Snippet;
		size?: ModalSize;
		/** Clicking the backdrop or pressing Escape closes the dialog. */
		dismissible?: boolean;
		/** Show the header's close button. Defaults to `dismissible` — turn it off
		 *  when the footer already carries the way out. */
		showClose?: boolean;
		footer?: Snippet;
		onclose?: () => void;
		children: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		icon,
		size = 'md',
		dismissible = true,
		showClose,
		footer,
		onclose,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	let dialog: HTMLDialogElement | null = $state(null);

	const closable = $derived(showClose ?? dismissible);

	const sizes: Record<ModalSize, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl'
	};

	$effect(() => syncDialog(dialog, open));

	function close() {
		open = false;
		onclose?.();
	}

	function onBackdrop(event: MouseEvent) {
		if (!dismissible) return;
		if (isBackdropClick(event, dialog)) close();
	}
</script>

<dialog
	bind:this={dialog}
	onclose={close}
	onclick={onBackdrop}
	oncancel={(event) => {
		if (!dismissible) event.preventDefault();
	}}
	class="m-auto w-[calc(100%-2rem)] rounded-xl border border-hairline bg-bg p-0 text-text shadow-2xl backdrop:bg-text/30 backdrop:backdrop-blur-[1px] {sizes[
		size
	]} {className}"
	{...rest}
>
	<div class="flex flex-col">
		{#if title || closable}
			<div class="flex items-start gap-4 px-6 pt-5 pb-3">
				{#if icon}<span class={iconLg}>{@render icon()}</span>{/if}
				<div class="flex min-w-0 flex-1 flex-col gap-1">
					{#if title}
						<h2 class="font-heading text-base font-semibold text-text">{title}</h2>
					{/if}
					{#if description}
						<p class="font-sans text-[13px] text-text-muted">{description}</p>
					{/if}
				</div>
				{#if closable}
					<button
						type="button"
						onclick={close}
						aria-label="Close"
						class="-m-1 shrink-0 rounded-md p-1 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
					>
						<svg class="size-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path
								d="m2 2 10 10M12 2 2 12"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				{/if}
			</div>
		{/if}

		<!--
			The body's top padding depends on what sits above it: 8px is the right
			gap under a header, and far too tight when there is none — a titleless
			modal, ConfirmDialog among them, would otherwise start against the edge.
		-->
		<div
			class="px-6 pb-5 font-sans text-sm leading-relaxed text-text-secondary
				{title || closable ? 'pt-2' : 'pt-5'}"
		>
			{@render children()}
		</div>

		{#if footer}
			<div
				class="flex items-center justify-end gap-2 rounded-b-xl border-t border-hairline bg-bg-alt px-6 py-4"
			>
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>
