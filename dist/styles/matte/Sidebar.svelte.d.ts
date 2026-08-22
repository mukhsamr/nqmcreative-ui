export interface SidebarItem {
    /** Stable id used for the active state. Falls back to `href`. */
    id?: string;
    label: string;
    href?: string;
    disabled?: boolean;
    badge?: string | number;
    /** Nested links — the parent becomes a collapsible group. */
    items?: SidebarItem[];
    /** Open the group on first render. */
    open?: boolean;
}
export interface SidebarSection {
    /** Small heading above a run of items. */
    label?: string;
    items: SidebarItem[];
}
import type { Snippet } from 'svelte';
import { type Tone } from '../../core/tones.js';
interface Props {
    sections: SidebarSection[];
    /** Bindable — the `id` (or `href`) of the current item. */
    value?: string;
    /** Bindable — narrow rail mode. */
    collapsed?: boolean;
    /** Show the collapse button. */
    collapsible?: boolean;
    tone?: Tone;
    header?: Snippet;
    footer?: Snippet;
    onnavigate?: (item: SidebarItem) => void;
    class?: string;
}
declare const Sidebar: import("svelte").Component<Props, {}, "value" | "collapsed">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
