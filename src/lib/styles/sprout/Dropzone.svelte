<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toneBorder, toneSoft, toneSurface, toneText, type Tone } from '../../core/tones.js';
	import { formatSize as toReadableSize, sortFiles, type RejectedFile } from '../../core/files.js';
	import { edge } from './lift.js';

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
		tone?: Tone;
		/** Headline inside the zone. Defaults to `Drop files here`. */
		label?: string;
		hint?: string;
		/** Hide the built-in file list to render your own. */
		showList?: boolean;
		onaccept?: (files: File[]) => void;
		onreject?: (rejected: RejectedFile[]) => void;
		/** Replaces the glyph above the label. */
		icon?: Snippet;
		class?: string;
	}

	let {
		files = $bindable([]),
		accept,
		multiple = true,
		maxSize = 0,
		maxFiles = 0,
		disabled = false,
		tone = 'brand',
		label,
		hint,
		showList = true,
		onaccept,
		onreject,
		icon,
		class: className = ''
	}: Props = $props();

	let input: HTMLInputElement | null = $state(null);
	let dragging = $state(false);
	let rejected = $state<RejectedFile[]>([]);
	/** Nested elements fire dragleave too, so count depth instead of toggling. */
	let depth = 0;

	const formatSize = (bytes: number) => toReadableSize(bytes);

	const defaultHint = $derived.by(() => {
		if (hint) return hint;
		// Symbols rather than words, so the auto-hint needs no translation.
		const parts: string[] = [];
		if (accept) parts.push(accept.replace(/,\s*/g, ', '));
		if (maxSize) parts.push(`≤ ${formatSize(maxSize)}`);
		if (maxFiles) parts.push(`×${maxFiles}`);
		return parts.join(' · ');
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

	function remove(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		depth = 0;
		dragging = false;
		add(event.dataTransfer?.files ?? null);
	}

	const reasons = $derived({
		type: 'wrong file type',
		size: 'too large',
		count: 'over the file limit'
	});
</script>

<div class="flex w-full flex-col gap-3 {className}">
	<button
		type="button"
		{disabled}
		onclick={() => input?.click()}
		ondragenter={(event) => {
			event.preventDefault();
			depth++;
			dragging = true;
		}}
		ondragover={(event) => event.preventDefault()}
		ondragleave={() => {
			depth = Math.max(0, depth - 1);
			if (depth === 0) dragging = false;
		}}
		ondrop={onDrop}
		class="flex w-full flex-col items-center gap-3 rounded-[28px] border-2 border-dashed px-6 py-10 text-center font-sans transition-colors duration-150 ease-brand-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50
			{dragging
			? `${toneBorder[tone]} ${toneSurface[tone]}`
			: 'border-hairline-strong bg-bg-alt/50 hover:bg-bg-alt'}
			{toneText[tone]}"
	>
		<span class="flex size-12 items-center justify-center rounded-full {toneSoft[tone]}">
			{#if icon}
				{@render icon()}
			{:else}
				<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M10 14V3.5M6 7.5 10 3.5l4 4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M3.5 13v3.5h13V13"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			{/if}
		</span>
		<span class="flex flex-col gap-1">
			<span class="text-sm font-semibold text-text">{label ?? 'Drop files here'}</span>
			<span class="text-[13px] text-text-secondary">
				or
				<span class="underline underline-offset-2">browse</span>
			</span>
			{#if defaultHint}
				<span class="text-xs text-text-muted">{defaultHint}</span>
			{/if}
		</span>
	</button>

	<input
		bind:this={input}
		type="file"
		{accept}
		{multiple}
		{disabled}
		class="sr-only"
		onchange={(event) => {
			add(event.currentTarget.files);
			event.currentTarget.value = '';
		}}
	/>

	{#if rejected.length}
		<ul class="flex flex-col gap-1">
			{#each rejected as item (item.file.name + item.reason)}
				<li class="font-sans text-[13px] text-danger">
					{item.file.name} — {reasons[item.reason]}
				</li>
			{/each}
		</ul>
	{/if}

	{#if showList && files.length}
		<ul class="flex flex-col rounded-[20px] border border-hairline bg-bg {edge}">
			{#each files as file, i (file.name + file.size + i)}
				<li
					class="flex items-center gap-3 border-b border-hairline px-4 py-2.5 font-sans last:border-b-0"
				>
					<span class="min-w-0 flex-1 truncate text-sm text-text">{file.name}</span>
					<span class="shrink-0 text-xs text-text-muted tabular-nums">{formatSize(file.size)}</span>
					<button
						type="button"
						onclick={() => remove(i)}
						aria-label="Remove {file.name}"
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
