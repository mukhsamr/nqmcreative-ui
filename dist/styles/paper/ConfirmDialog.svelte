<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { toneSoft, type Tone } from '../../core/tones.js';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		/** Drives the confirm button and the glyph. `danger` for destructive acts. */
		tone?: Tone;
		confirmLabel?: string;
		cancelLabel?: string;
		/** Spins the confirm button and blocks dismissal while the action runs. */
		loading?: boolean;
		/** Awaited — the dialog stays open and busy until it settles. */
		onconfirm?: () => void | Promise<void>;
		oncancel?: () => void;
		icon?: Snippet;
		/** Extra content between the description and the buttons. */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		tone = 'danger',
		confirmLabel,
		cancelLabel,
		loading = $bindable(false),
		onconfirm,
		oncancel,
		icon,
		children
	}: Props = $props();

	async function confirm() {
		try {
			loading = true;
			await onconfirm?.();
			open = false;
		} finally {
			loading = false;
		}
	}

	function cancel() {
		if (loading) return;
		open = false;
		oncancel?.();
	}
</script>

<Modal
	bind:open
	size="sm"
	dismissible={!loading}
	showClose={false}
	onclose={() => (loading = false)}
>
	<div class="flex items-start gap-4">
		<span class="flex size-10 shrink-0 items-center justify-center rounded-full {toneSoft[tone]}">
			{#if icon}
				{@render icon()}
			{:else}
				<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
					<path d="M10 5.75v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					<circle cx="10" cy="14" r="1" fill="currentColor" />
				</svg>
			{/if}
		</span>
		<div class="flex min-w-0 flex-1 flex-col gap-1.5">
			<h2 class="font-heading text-base font-semibold text-text">{title}</h2>
			{#if description}
				<p class="text-[13px] leading-relaxed text-text-secondary">{description}</p>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>

	{#snippet footer()}
		<Button variant="outline" tone="neutral" onclick={cancel} disabled={loading}>
			{cancelLabel ?? 'Cancel'}
		</Button>
		<Button {tone} onclick={confirm} {loading}>
			{confirmLabel ?? 'Confirm'}
		</Button>
	{/snippet}
</Modal>
