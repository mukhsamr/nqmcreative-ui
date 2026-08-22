/**
 * The list machinery behind every "type to filter, arrow to choose" control —
 * Combobox, MultiSelect, CommandPalette.
 *
 * All three want the same four things: match a query, bundle the matches under
 * their group headings, flatten them back into one indexable run, and move an
 * active cursor over that run while skipping disabled entries. None of it has
 * an opinion about how a row looks, so all of it lives here.
 */
/** Case-insensitive substring match over whichever fields a control cares about. */
export function matchQuery(items, query, haystack) {
    const needle = query.trim().toLowerCase();
    if (!needle)
        return items;
    return items.filter((item) => haystack(item).toLowerCase().includes(needle));
}
/**
 * Buckets items by `group`, keeping first-seen order for both the groups and
 * the items inside them. Ungrouped items land under `''`.
 */
export function groupItems(items) {
    const out = [];
    for (const item of items) {
        const key = item.group ?? '';
        const bucket = out.find(([name]) => name === key);
        if (bucket)
            bucket[1].push(item);
        else
            out.push([key, [item]]);
    }
    return out;
}
/**
 * An active-item cursor over a list that changes as the user types.
 *
 * `items` is a getter rather than an array so the cursor always reads the
 * current matches — the caller keeps ownership of the filtering.
 */
export class ListCursor {
    #items;
    /** Index into the flattened list. */
    index = $state(0);
    constructor(items) {
        this.#items = items;
    }
    get items() {
        return this.#items();
    }
    get current() {
        return this.items[this.index];
    }
    /** Jumps to the first item matching `predicate`, or to the top. */
    reset(predicate) {
        if (!predicate) {
            this.index = 0;
            return;
        }
        this.index = Math.max(0, this.items.findIndex(predicate));
    }
    /** Wraps around, skipping disabled entries. */
    move(step) {
        const items = this.items;
        if (items.length === 0)
            return;
        let next = this.index;
        for (let i = 0; i < items.length; i++) {
            next = (next + step + items.length) % items.length;
            if (!items[next].disabled)
                break;
        }
        this.index = next;
    }
}
/** Brings the row carrying `data-index` into view without scrolling the page. */
export function revealIndex(container, index) {
    container?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
}
