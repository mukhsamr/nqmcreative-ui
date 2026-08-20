import type { Snippet } from 'svelte';
import { type Placement } from '../actions/anchor.js';
interface Props {
    trigger: Snippet;
    children: Snippet;
    open?: boolean;
    placement?: Placement;
    offset?: number;
    title?: string;
    /** `'hover'` also opens on focus, for read-only content. */
    on?: 'click' | 'hover';
    /** Keep focus where it is — right for hover popovers and hover cards. */
    trapFocus?: boolean;
    class?: string;
    triggerClass?: string;
}
declare const Popover: import("svelte").Component<Props, {}, "open">;
type Popover = ReturnType<typeof Popover>;
export default Popover;
