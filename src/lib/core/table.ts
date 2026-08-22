/**
 * Sorting and selection for a data table. Both are pure functions over rows,
 * so a style only has to decide what a header and a checked row look like.
 */

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
	key: string;
	direction: SortDirection;
}

/**
 * Clicking a header cycles ascending → descending → unsorted, which is what
 * lets a user get back to the server's original order.
 */
export function nextSort(current: TableSort | null, key: string): TableSort | null {
	if (current?.key !== key) return { key, direction: 'asc' };
	if (current.direction === 'asc') return { key, direction: 'desc' };
	return null;
}

/**
 * Sorts a copy of `rows`. Numbers compare numerically, everything else through
 * `localeCompare` with `numeric`, so `item 2` lands before `item 10`. Nullish
 * values sink to the bottom either way round.
 */
export function sortRows<T extends Record<string, unknown>>(
	rows: T[],
	sort: TableSort | null
): T[] {
	if (!sort) return rows;
	const { key, direction } = sort;
	const factor = direction === 'asc' ? 1 : -1;
	return [...rows].sort((a, b) => {
		const x = a[key];
		const y = b[key];
		if (x == null) return 1;
		if (y == null) return -1;
		if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
		return String(x).localeCompare(String(y), undefined, { numeric: true }) * factor;
	});
}

/** Adds or removes one key, preserving the order the rest were chosen in. */
export function toggleKey(selected: string[], key: string): string[] {
	return selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
}
