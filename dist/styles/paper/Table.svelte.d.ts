export interface TableColumn {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    /** Extra classes for this column's cells, e.g. `'w-40 tabular-nums'`. */
    class?: string;
    /** Allow clicking the header to sort by this column. */
    sortable?: boolean;
}
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
import { type TableSort } from '../../core/table.js';
declare function $$render<T extends Record<string, unknown>>(): {
    props: Omit<HTMLAttributes<HTMLDivElement>, "onselect"> & {
        columns: TableColumn[];
        rows: T[];
        /** Custom cell rendering — falls back to the raw value. */
        cell?: Snippet<[{
            row: T;
            column: TableColumn;
            value: unknown;
        }]>;
        /** Shown instead of the body when `rows` is empty. */
        empty?: Snippet;
        caption?: string;
        striped?: boolean;
        hoverable?: boolean;
        compact?: boolean;
        /** Header stays put while the body scrolls — pair with a `max-h-*` class. */
        stickyHeader?: boolean;
        /** Bar above the table — a title, a search field, a filter row. */
        header?: Snippet;
        /** Bar below the table — pagination, a total, a summary line. */
        footer?: Snippet;
        /**
         * Shown in place of `header` while rows are ticked, after the count and the
         * clear button. Passing it is what turns the bulk bar on.
         */
        bulkActions?: Snippet<[{
            selected: string[];
            clear: () => void;
        }]>;
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
    };
    exports: {};
    bindings: "sort" | "selected";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends Record<string, unknown>> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "sort" | "selected";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends Record<string, unknown>>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends Record<string, unknown>>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Table: $$IsomorphicComponent;
type Table<T extends Record<string, unknown>> = InstanceType<typeof Table<T>>;
export default Table;
