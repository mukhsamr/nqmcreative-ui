<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toneBorder, toneSoft, toneSurface, toneText, type Tone } from '../tones.js';
	import { useLocale } from '../locale.svelte.js';

	export interface RejectedFile {
		file: File;
		reason: 'type' | 'size' | 'count';
	}

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
		/** Headline inside the zone. Defaults to the locale's `dropFiles`. */
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

	const t = useLocale();

	let input: HTMLInputElement | null = $state(null);
	let dragging = $state(false);
	let rejected = $state<RejectedFile[]>([]);
	/** Nested elements fire dragleave too, so count depth instead of toggling. */
	let depth = 0;

	const defaultHint = $derived.by(() => {
		if (hint) return hint;
		// Symbols rather than words, so the auto-hint needs no translation.
		const parts: string[] = [];
		if (accept) parts.push(accept.replace(/,\s*/g, ', '));
		if (maxSize) parts.push(`≤ ${formatSize(maxSize)}`);
		if (maxFiles) parts.push(`×${maxFiles}`);
		return parts.join(' · ');
	});

	function formatSize(bytes: number) {
		const units = t.current.byteUnits;
		if (bytes < 1024) return `${bytes} ${units[0]}`;
		let value = bytes / 1024;
		let i = 1;
		while (value >= 1024 && i < units.length - 1) {
			value /= 1024;
			i++;
		}
		return `${value.toFixed(Number.isInteger(value) || value >= 10 ? 0 : 1)} ${units[i]}`;
	}

	function matchesAccept(file: File) {
		if (!accept) return true;
		return accept.split(',').some((raw) => {
			const rule = raw.trim().toLowerCase();
			if (!rule) return true;
			if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
			if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
			return file.type.toLowerCase() === rule;
		});
	}

	function add(incoming: FileList | File[] | null) {
		if (!incoming || disabled) return;

		const accepted: File[] = [];
		const bad: RejectedFile[] = [];
		let room = maxFiles ? maxFiles - (multiple ? files.length : 0) : Infinity;

		for (const file of Array.from(incoming)) {
			if (!matchesAccept(file)) bad.push({ file, reason: 'type' });
			else if (maxSize && file.size > maxSize) bad.push({ file, reason: 'size' });
			else if (room <= 0) bad.push({ file, reason: 'count' });
			else {
				accepted.push(file);
				room--;
			}
			if (!multiple && accepted.length === 1) break;
		}

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

	const reasons: Record<RejectedFile['reason'], string> = $derived({
		type: t.current.rejectedType,
		size: t.current.rejectedSize,
		count: t.current.rejectedCount
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
		class="flex w-full flex-col items-center gap-3 border border-dashed px-6 py-10 text-center font-sans transition-colors duration-150 ease-brand-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50
			{dragging
			? `${toneBorder[tone]} ${toneSurface[tone]}`
			: 'border-hairline-strong bg-bg hover:bg-bg-alt'}
			{toneText[tone]}"
	>
		<span class="flex size-12 items-center justify-center rounded-full {toneSoft[tone]}">
			{#if icon}
				{@render icon()}
			{:else}
				<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path d="M10 14V3.5M6 7.5 10 3.5l4 4" stroke="currentColor" stroke-width="1.5" />
					<path d="M3.5 13v3.5h13V13" stroke="currentColor" stroke-width="1.5" />
				</svg>
			{/if}
		</span>
		<span class="flex flex-col gap-1">
			<span class="text-[15px] font-medium text-text">{label ?? t.current.dropFiles}</span>
			<span class="text-sm text-text-secondary">
				{t.current.or}
				<span class="underline underline-offset-4">{t.current.browse}</span>
			</span>
			{#if defaultHint}
				<span class="font-mono text-xs text-text-muted">{defaultHint}</span>
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
				<li class="font-sans text-sm text-danger">
					{item.file.name} — {reasons[item.reason]}
				</li>
			{/each}
		</ul>
	{/if}

	{#if showList && files.length}
		<ul class="flex flex-col border border-hairline">
			{#each files as file, i (file.name + file.size + i)}
				<li
					class="flex items-center gap-3 border-b border-hairline px-4 py-3 font-sans last:border-b-0"
				>
					<span class="min-w-0 flex-1 truncate text-sm text-text">{file.name}</span>
					<span class="shrink-0 font-mono text-xs text-text-muted">{formatSize(file.size)}</span>
					<button
						type="button"
						onclick={() => remove(i)}
						aria-label="{t.current.remove} {file.name}"
						class="-m-1 shrink-0 p-1 text-text-muted transition-colors duration-150 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
					>
						<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
