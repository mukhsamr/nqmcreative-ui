<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { toneFocusWithinBorder, type Tone } from '../../core/tones.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { passwordScore } from '../../core/password.js';
	import { edge } from './lift.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
		value?: string;
		tone?: Tone;
		invalid?: boolean;
		/** Draws a four-segment strength meter under the field. */
		strength?: boolean;
	}

	let {
		value = $bindable(''),
		tone = 'brand',
		invalid = false,
		strength = false,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	let visible = $state(false);

	const score = $derived(passwordScore(value));

	const bars = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];
	const texts = ['text-danger', 'text-danger', 'text-warning', 'text-info', 'text-success'];
</script>

<div class="flex w-full flex-col gap-2">
	<span
		class="inline-flex w-full items-center gap-2 rounded-xl border bg-bg pr-1 pl-3 {edge} transition-colors duration-150 ease-brand-out
			{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
			{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
	>
		<input
			bind:value
			{disabled}
			type={visible ? 'text' : 'password'}
			aria-invalid={invalid ? 'true' : undefined}
			class="h-10 w-full min-w-0 bg-transparent font-sans text-sm text-text placeholder:text-text-muted focus:outline-none"
			{...rest}
		/>
		<button
			type="button"
			onclick={() => (visible = !visible)}
			aria-label={visible ? t.current.hidePassword : t.current.showPassword}
			aria-pressed={visible}
			class="shrink-0 rounded p-1.5 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
		>
			{#if visible}
				<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z"
						stroke="currentColor"
						stroke-width="1.4"
					/>
					<circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4" />
					<path
						d="m3.5 16.5 13-13"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
					/>
				</svg>
			{:else}
				<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z"
						stroke="currentColor"
						stroke-width="1.4"
					/>
					<circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4" />
				</svg>
			{/if}
		</button>
	</span>

	{#if strength}
		<div class="flex items-center gap-3">
			<div class="flex flex-1 gap-1" aria-hidden="true">
				{#each [0, 1, 2, 3] as segment (segment)}
					<span
						class="h-1 flex-1 rounded-full transition-colors duration-200 {segment < score
							? bars[score]
							: 'bg-bg-inset'}"
					></span>
				{/each}
			</div>
			<span class="text-xs font-medium {value ? texts[score] : 'text-text-muted'}">
				{value ? t.current.passwordStrength[score] : '—'}
			</span>
		</div>
	{/if}
</div>
