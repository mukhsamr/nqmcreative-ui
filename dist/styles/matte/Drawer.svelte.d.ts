import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
interface Props extends HTMLDialogAttributes {
    /** Bindable. Built on the native `<dialog>`, so it gets the top layer,
     *  the backdrop, Escape handling and focus containment for free. */
    open?: boolean;
    side?: DrawerSide;
    size?: DrawerSize;
    title?: string;
    description?: string;
    /** Leading icon beside the title. */
    icon?: Snippet;
    dismissible?: boolean;
    footer?: Snippet;
    onclose?: () => void;
    children: Snippet;
}
declare const Drawer: import("svelte").Component<Props, {}, "open">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
