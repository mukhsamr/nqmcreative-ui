<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		/** Helper text under the control. Hidden while `error` is set. */
		hint?: string;
		/** Replaces the hint and turns it red. */
		error?: string;
		required?: boolean;
		/** `id` of the control — set the same value on the input inside. */
		for?: string;
		children: Snippet;
	}

	let {
		label,
		hint,
		error,
		required = false,
		for: htmlFor,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const messageId = $derived(error ? `${uid}-error` : hint ? `${uid}-hint` : undefined);

	interface Described {
		for?: string;
		messageId?: string;
		required: boolean;
		invalid: boolean;
	}

	/**
	 * A hint nobody can hear is not a hint. `aria-describedby` has to sit on the
	 * control, and the control arrives through `children` — out of reach of this
	 * template — so the field finds it once the DOM exists and keeps the three
	 * attributes in step itself. It touches only what it set: an `aria-invalid`
	 * the control already carries from its own `invalid` prop stays that
	 * control's business.
	 */
	function describes(node: HTMLElement, state: Described) {
		let ourId: string | undefined;
		let ownsInvalid = false;

		const apply = (next: Described) => {
			const control =
				(next.for ? node.querySelector<HTMLElement>(`#${CSS.escape(next.for)}`) : null) ??
				node.querySelector<HTMLElement>('input, select, textarea');
			if (!control) return;

			const ids = (control.getAttribute('aria-describedby') ?? '')
				.split(/\s+/)
				.filter((id) => id && id !== ourId);
			if (next.messageId) ids.push(next.messageId);
			if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
			else control.removeAttribute('aria-describedby');
			ourId = next.messageId;

			if (next.required) control.setAttribute('aria-required', 'true');
			else control.removeAttribute('aria-required');

			if (next.invalid) {
				ownsInvalid ||= !control.hasAttribute('aria-invalid');
				control.setAttribute('aria-invalid', 'true');
			} else if (ownsInvalid) {
				control.removeAttribute('aria-invalid');
				ownsInvalid = false;
			}
		};

		apply(state);
		return { update: apply };
	}
</script>

<div
	use:describes={{ for: htmlFor, messageId, required, invalid: Boolean(error) }}
	class="flex w-full flex-col gap-2 {className}"
	{...rest}
>
	{#if label}
		<label for={htmlFor} class="font-sans text-sm font-medium text-text">
			{label}
			{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if error}
		<p id="{uid}-error" role="alert" class="font-sans text-sm text-danger">{error}</p>
	{:else if hint}
		<p id="{uid}-hint" class="font-sans text-sm text-text-muted">{hint}</p>
	{/if}
</div>
