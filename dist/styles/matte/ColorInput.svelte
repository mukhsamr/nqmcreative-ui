<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { normaliseHex } from '../../core/color.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import type { Tone } from '../../core/tones.js';
	import Input, { type InputSize } from './Input.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix' | 'type'> {
		/** Bindable `#rrggbb`. Shorthand and alpha are normalised away on blur. */
		value?: string;
		size?: InputSize;
		tone?: Tone;
		invalid?: boolean;
		/** Fixed choices under the field. Empty hides the row. */
		swatches?: string[];
		class?: string;
	}

	let {
		value = $bindable('#000000'),
		size = 'md',
		tone = 'brand',
		invalid = false,
		disabled = false,
		swatches = [],
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	// The text can be mid-typing (`#a2`) while the swatch needs a real colour,
	// so the swatch follows the last value that parsed rather than the field.
	let text = $state('');
	let editing = $state(false);

	$effect(() => {
		if (!editing) text = value;
	});

	const resolved = $derived(normaliseHex(text) ?? normaliseHex(value) ?? '#000000');

	// Same reason as CurrencyInput: at input time the bound `text` is one
	// keystroke behind, so the element is the only current source.
	function onText(event: Event & { currentTarget: HTMLInputElement }) {
		const hex = normaliseHex(event.currentTarget.value);
		if (hex) value = hex;
	}

	function settle() {
		editing = false;
		value = normaliseHex(text) ?? value;
		text = value;
	}

	function choose(hex: string) {
		value = normaliseHex(hex) ?? value;
		text = value;
	}
</script>

<div class="flex w-full flex-col gap-2 {className}">
	<Input
		bind:value={text}
		{size}
		{tone}
		{invalid}
		{disabled}
		spellcheck="false"
		autocapitalize="none"
		placeholder="#000000"
		oninput={onText}
		onfocus={() => (editing = true)}
		onblur={settle}
		class="[&_input]:font-mono [&_input]:uppercase"
		{...rest}
	>
		{#snippet prefix()}
			<span class="relative grid size-5 place-items-center border border-hairline">
				<span class="absolute inset-0" style="background-color: {resolved}"></span>
				<input
					type="color"
					value={resolved}
					{disabled}
					aria-label={t.current.pickColour}
					oninput={(event) => choose(event.currentTarget.value)}
					class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
				/>
			</span>
		{/snippet}
	</Input>

	{#if swatches.length}
		<div class="flex flex-wrap gap-1.5">
			{#each swatches as swatch (swatch)}
				<button
					type="button"
					{disabled}
					onclick={() => choose(swatch)}
					title={swatch}
					aria-label={swatch}
					aria-pressed={resolved === normaliseHex(swatch)}
					class="size-6 border transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:pointer-events-none disabled:opacity-50
						{resolved === normaliseHex(swatch) ? 'border-text' : 'border-hairline'}"
					style="background-color: {swatch}"
				></button>
			{/each}
		</div>
	{/if}
</div>
