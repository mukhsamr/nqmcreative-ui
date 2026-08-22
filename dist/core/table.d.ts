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
export declare function nextSort(current: TableSort | null, key: string): TableSort | null;
/**
 * Sorts a copy of `rows`. Numbers compare numerically, everything else through
 * `localeCompare` with `numeric`, so `item 2` lands before `item 10`. Nullish
 * values sink to the bottom either way round.
 */
export declare function sortRows<T extends Record<string, unknown>>(rows: T[], sort: TableSort | null): T[];
/** Adds or removes one key, preserving the order the rest were chosen in. */
export declare function toggleKey(selected: string[], key: string): string[];
