<script lang="ts">
	import type { Snippet } from 'svelte';
	import { iconLg } from './icon.js';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { useLocale } from '../../core/locale.svelte.js';
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

	const t = useLocale();
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
	class="m-auto w-[calc(100%-2rem)] border border-hairline bg-bg p-0 text-text backdrop:bg-text/40 {sizes[
		size
	]} {className}"
	{...rest}
>
	<div class="flex flex-col">
		{#if title || closable}
			<div class="flex items-start gap-4 border-b border-hairline px-5 py-4">
				{#if icon}<span class={iconLg}>{@render icon()}</span>{/if}
				<div class="flex min-w-0 flex-1 flex-col gap-1">
					{#if title}
						<h2 class="font-heading text-lg font-medium tracking-tight">{title}</h2>
					{/if}
					{#if description}
						<p class="font-sans text-sm text-text-secondary">{description}</p>
					{/if}
				</div>
				{#if closable}
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

		<div class="px-5 py-4 font-sans text-[15px] leading-relaxed text-text-secondary">
			{@render children()}
		</div>

		{#if footer}
			<div class="flex items-center justify-end gap-3 border-t border-hairline px-5 py-3.5">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>
