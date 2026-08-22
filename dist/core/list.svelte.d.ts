/**
 * The list machinery behind every "type to filter, arrow to choose" control —
 * Combobox, MultiSelect, CommandPalette.
 *
 * All three want the same four things: match a query, bundle the matches under
 * their group headings, flatten them back into one indexable run, and move an
 * active cursor over that run while skipping disabled entries. None of it has
 * an opinion about how a row looks, so all of it lives here.
 */
export interface ListItem {
    disabled?: boolean;
    /** Items sharing a group are rendered under one heading. */
    group?: string;
}
/** Case-insensitive substring match over whichever fields a control cares about. */
export declare function matchQuery<T>(items: T[], query: string, haystack: (item: T) => string): T[];
/**
 * Buckets items by `group`, keeping first-seen order for both the groups and
 * the items inside them. Ungrouped items land under `''`.
 */
export declare function groupItems<T extends ListItem>(items: T[]): [string, T[]][];
/**
 * An active-item cursor over a list that changes as the user types.
 *
 * `items` is a getter rather than an array so the cursor always reads the
 * current matches — the caller keeps ownership of the filtering.
 */
export declare class ListCursor<T extends ListItem> {
    #private;
    /** Index into the flattened list. */
    index: number;
    constructor(items: () => T[]);
    get items(): T[];
    get current(): T | undefined;
    /** Jumps to the first item matching `predicate`, or to the top. */
    reset(predicate?: (item: T) => boolean): void;
    /** Wraps around, skipping disabled entries. */
    move(step: number): void;
}
/** Brings the row carrying `data-index` into view without scrolling the page. */
export declare function revealIndex(container: HTMLElement | null, index: number): void;
