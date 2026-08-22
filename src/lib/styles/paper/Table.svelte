<script module lang="ts">
	export interface TableColumn {
		key: string;
		label: string;
		align?: 'left' | 'center' | 'right';
		/** Extra classes for this column's cells, e.g. `'w-40 tabular-nums'`. */
		class?: string;
		/** Allow clicking the header to sort by this column. */
		sortable?: boolean;
	}
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Checkbox from './Checkbox.svelte';
	import type { Tone } from '../../core/tones.js';
	import { nextSort, sortRows, toggleKey, type TableSort } from '../../core/table.js';
	import { useLocale } from '../../core/locale.svelte.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
		columns: TableColumn[];
		rows: T[];
		/** Custom cell rendering — falls back to the raw value. */
		cell?: Snippet<[{ row: T; column: TableColumn; value: unknown }]>;
		/** Shown instead of the body when `rows` is empty. */
		empty?: Snippet;
		caption?: string;
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		/** Header stays put while the body scrolls — pair with a `max-h-*` class. */
		stickyHeader?: boolean;

		/** Bindable. Set it to sort; leave `sortable` columns to drive it. */
		sort?: TableSort | null;
		/** Sort the rows here rather than refetching them server-side. Default true. */
		sortLocally?: boolean;
		onsort?: (sort: TableSort | null) => void;

		/** Turns on the checkbox column. Bindable list of selected row keys. */
		selectable?: boolean;
		selected?: string[];
		/** Which field identifies a row. Default `'id'`. */
		rowKey?: string;
		tone?: Tone;
		onselect?: (selected: string[]) => void;
	}

	let {
		columns,
		rows,
		cell,
		empty,
		caption,
		striped = false,
		hoverable = true,
		compact = false,
		stickyHeader = false,
		sort = $bindable(null),
		sortLocally = true,
		onsort,
		selectable = false,
		selected = $bindable([]),
		rowKey = 'id',
		tone = 'brand',
		onselect,
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	const aligns = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	};

	const pad = $derived(compact ? 'px-4 py-2' : 'px-4 py-3');

	const sorted = $derived(sortLocally ? sortRows(rows, sort) : rows);

	function toggleSort(column: TableColumn) {
		if (!column.sortable) return;
		const next = nextSort(sort, column.key);
		sort = next;
		onsort?.(next);
	}

	const keyOf = (row: T) => String(row[rowKey] ?? '');

	const allSelected = $derived(
		sorted.length > 0 && sorted.every((row) => selected.includes(keyOf(row)))
	);
	const someSelected = $derived(
		!allSelected && sorted.some((row) => selected.includes(keyOf(row)))
	);

	function toggleAll() {
		selected = allSelected ? [] : sorted.map(keyOf);
		onselect?.(selected);
	}

	function toggleRow(row: T) {
		selected = toggleKey(selected, keyOf(row));
		onselect?.(selected);
	}
</script>

<div
	class="w-full overflow-auto rounded-lg border border-hairline bg-bg shadow-xs {className}"
	{...rest}
>
	<table class="w-full border-collapse font-sans text-sm">
		{#if caption}
			<caption
				class="border-b border-hairline px-4 py-3 text-left font-sans text-[13px] text-text-muted"
			>
				{caption}
			</caption>
		{/if}
		<thead class={stickyHeader ? 'sticky top-0 z-10' : ''}>
			<tr class="border-b border-hairline bg-bg-alt">
				{#if selectable}
					<th scope="col" class="w-10 {pad}">
						<Checkbox
							checked={allSelected}
							indeterminate={someSelected}
							{tone}
							aria-label={t.current.selectAllRows}
							onchange={toggleAll}
						/>
					</th>
				{/if}
				{#each columns as column (column.key)}
					<th
						scope="col"
						aria-sort={sort?.key === column.key
							? sort.direction === 'asc'
								? 'ascending'
								: 'descending'
							: undefined}
						class="text-[13px] font-semibold text-text-muted {pad} {aligns[
							column.align ?? 'left'
						]} {column.class ?? ''}"
					>
						{#if column.sortable}
							<button
								type="button"
								onclick={() => toggleSort(column)}
								class="inline-flex items-center gap-1.5 rounded transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current
									{sort?.key === column.key ? 'text-text' : ''}"
							>
								{column.label}
								<span class="text-[9px] leading-none" aria-hidden="true">
									{#if sort?.key === column.key}
										{sort.direction === 'asc' ? '▲' : '▼'}
									{:else}
										⇅
									{/if}
								</span>
							</button>
						{:else}
							{column.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if sorted.length === 0}
				<tr>
					<td
						colspan={columns.length + (selectable ? 1 : 0)}
						class="px-4 py-10 text-center text-sm text-text-muted"
					>
						{#if empty}{@render empty()}{:else}{t.current.noData}{/if}
					</td>
				</tr>
			{:else}
				{#each sorted as row, i (selectable ? keyOf(row) : i)}
					{@const isSelected = selectable && selected.includes(keyOf(row))}
					<tr
						aria-selected={selectable ? isSelected : undefined}
						class="border-b border-hairline last:border-b-0
							{isSelected ? 'bg-brand-light' : striped && i % 2 === 1 ? 'bg-bg-alt' : ''}
							{hoverable ? 'transition-colors duration-150 hover:bg-bg-alt' : ''}"
					>
						{#if selectable}
							<td class={pad}>
								<Checkbox
									checked={isSelected}
									{tone}
									aria-label={t.current.selectRow}
									onchange={() => toggleRow(row)}
								/>
							</td>
						{/if}
						{#each columns as column (column.key)}
							<td
								class="text-text-secondary {pad} {aligns[column.align ?? 'left']} {column.class ??
									''}"
							>
								{#if cell}
									{@render cell({ row, column, value: row[column.key] })}
								{:else}
									{row[column.key] ?? ''}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
