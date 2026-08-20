import type { Snippet } from 'svelte';
import { type Placement } from '../actions/anchor.js';
interface Props {
    /** The control that opens the menu — put a `Button` in here. */
    trigger: Snippet;
    /** Menu contents: `MenuItem`, `MenuSeparator`, or anything else. */
    children: Snippet;
    open?: boolean;
    placement?: Placement;
    offset?: number;
    /** Stretch the menu to the trigger's width. */
    matchWidth?: boolean;
    /** Close as soon as an item inside is activated. Default true. */
    closeOnSelect?: boolean;
    /** Accessible name for the menu. Defaults to the locale's `menu`. */
    label?: string;
    class?: string;
    /** Classes for the wrapper around the trigger. */
    triggerClass?: string;
}
declare const Dropdown: import("svelte").Component<Props, {}, "open">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
