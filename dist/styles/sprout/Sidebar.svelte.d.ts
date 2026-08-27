import type { Snippet } from 'svelte';
export type SidebarVariant = 'plain' | 'filled' | 'floating';
export interface SidebarItem {
    /** Stable id used for the active state. Falls back to `href`. */
    id?: string;
    label: string;
    href?: string;
    disabled?: boolean;
    badge?: string | number;
    /**
     * Leading glyph, 16px. The one thing a collapsed rail still shows, so
     * an item that has to survive `collapsed` needs one.
     */
    icon?: Snippet;
    /** Nested links — the parent becomes a collapsible group. */
    items?: SidebarItem[];
    /** Open the group on first render. */
    open?: boolean;
    /**
     * `false` pins a group open: the parent stops being a button and the
     * children are always on show. For navigation a reader should not be
     * able to lose.
     */
    collapsible?: boolean;
}
export interface SidebarSection {
    /** Small heading above a run of items. */
    label?: string;
    items: SidebarItem[];
}
import { type Tone } from '../../core/tones.js';
interface Props {
    sections: SidebarSection[];
    /** Bindable — the `id` (or `href`) of the current item. */
    value?: string;
    /** Bindable — narrow rail mode. */
    collapsed?: boolean;
    /** Show the collapse button. */
    collapsible?: boolean;
    /** Surface treatment: bare, the framed default, or a detached card. */
    variant?: SidebarVariant;
    tone?: Tone;
    header?: Snippet;
    footer?: Snippet;
    onnavigate?: (item: SidebarItem) => void;
    class?: string;
}
declare const Sidebar: import("svelte").Component<Props, {}, "value" | "collapsed">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
