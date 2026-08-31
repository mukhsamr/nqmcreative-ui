<script lang="ts">
	import { formatSize as toReadableSize, sortFiles, type RejectedFile } from '../../core/files.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { toneFocusWithinBorder, type Tone } from '../../core/tones.js';
	import type { InputSize } from './Input.svelte';

	interface Props {
		/** Bindable list of accepted files. */
		files?: File[];
		/** Same syntax as the input's `accept` — `'image/*,.pdf'`. */
		accept?: string;
		multiple?: boolean;
		/** Per-file ceiling in bytes. `0` means no limit. */
		maxSize?: number;
		/** Cap on how many files may be held at once. `0` means no limit. */
		maxFiles?: number;
		disabled?: boolean;
		size?: InputSize;
		tone?: Tone;
		invalid?: boolean;
		/** Text on the button. Defaults to the locale's `chooseFile`. */
		label?: string;
		/** Shown while nothing is chosen. Defaults to the locale's `noFile`. */
		placeholder?: string;
		/** Show the list of held files below the row. */
		showList?: boolean;
		/** The `name` the hidden input posts under, for a plain form submit. */
		name?: string;
		onaccept?: (files: File[]) => void;
		onreject?: (rejected: RejectedFile[]) => void;
		class?: string;
	}

	let {
		files = $bindable([]),
		accept,
		multiple = false,
		maxSize = 0,
		maxFiles = 0,
		disabled = false,
		size = 'md',
		tone = 'brand',
		invalid = false,
		label,
		placeholder,
		showList = true,
		name,
		onaccept,
		onreject,
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	let input: HTMLInputElement | null = $state(null);
	let rejected = $state<RejectedFile[]>([]);

	const formatSize = (bytes: number) => toReadableSize(bytes, t.current.byteUnits);

	/** One file reads as its name and weight; several read as a count. */
	const summary = $derived.by(() => {
		if (files.length === 0) return placeholder ?? t.current.noFile;
		if (files.length === 1) return `${files[0].name} · ${formatSize(files[0].size)}`;
		return `${files.length} ${t.current.selected}`;
	});

	function add(incoming: FileList | File[] | null) {
		if (!incoming || disabled) return;

		const { accepted, rejected: bad } = sortFiles(incoming, {
			accept,
			maxSize,
			maxFiles,
			multiple,
			held: files.length
		});

		rejected = bad;
		if (bad.length) onreject?.(bad);
		if (accepted.length === 0) return;

		files = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
		onaccept?.(accepted);
	}

	function clear() {
		files = [];
		rejected = [];
		if (input) input.value = '';
	}

	const reasons: Record<RejectedFile['reason'], string> = $derived({
		type: t.current.rejectedType,
		size: t.current.rejectedSize,
		count: t.current.rejectedCount
	});

	const sizes: Record<InputSize, string> = {
		sm: 'h-8 text-[13px]',
		md: 'h-10 text-sm',
		lg: 'h-11 text-[15px]'
	};

	const buttons: Record<InputSize, string> = {
		sm: 'h-6 px-2 text-[11px]',
		md: 'h-7 px-2.5 text-xs',
		lg: 'h-8 px-3 text-xs'
	};
</script>

<div class="flex w-full flex-col gap-3 {className}">
	<span
		class="inline-flex w-full items-center gap-2 rounded-md border bg-bg px-1 shadow-xs transition-colors duration-150 ease-brand-out
			{sizes[size]}
			{invalid
			? 'border-danger focus-within:border-danger'
			: `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
			{disabled ? 'pointer-events-none opacity-50' : ''}"
	>
		<button
			type="button"
			{disabled}
			onclick={() => input?.click()}
			class="shrink-0 rounded border border-hairline-strong bg-bg-alt font-sans font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current
				{buttons[size]}"
		>
			{label ?? t.current.chooseFile}
		</button>

		<span
			class="min-w-0 flex-1 truncate font-sans {files.length ? 'text-text' : 'text-text-muted'}"
		>
			{summary}
		</span>

		{#if files.length}
			<button
				type="button"
				onclick={clear}
				aria-label={t.current.remove}
				class="mr-1 shrink-0 rounded p-1 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
			>
				<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path
						d="m2 2 10 10M12 2 2 12"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		{/if}
	</span>

	<input
		bind:this={input}
		type="file"
		{name}
		{accept}
		{multiple}
		{disabled}
		aria-invalid={invalid ? 'true' : undefined}
		class="sr-only"
		onchange={(event) => add(event.currentTarget.files)}
	/>

	{#if rejected.length}
		<ul class="flex flex-col gap-1">
			{#each rejected as item (item.file.name + item.reason)}
				<li class="font-sans text-sm text-danger">
					{item.file.name} — {reasons[item.reason]}
				</li>
			{/each}
		</ul>
	{/if}

	{#if showList && multiple && files.length > 1}
		<ul class="flex flex-col rounded-lg border border-hairline bg-bg shadow-xs">
			{#each files as file, i (file.name + file.size + i)}
				<li
					class="flex items-center gap-3 border-b border-hairline px-4 py-2.5 font-sans last:border-b-0"
				>
					<span class="min-w-0 flex-1 truncate text-sm text-text">{file.name}</span>
					<span class="shrink-0 text-xs text-text-muted tabular-nums">{formatSize(file.size)}</span>
					<button
						type="button"
						onclick={() => (files = files.filter((_, at) => at !== i))}
						aria-label="{t.current.remove} {file.name}"
						class="-m-1 shrink-0 rounded p-1 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
					>
						<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path
								d="m2 2 10 10M12 2 2 12"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
