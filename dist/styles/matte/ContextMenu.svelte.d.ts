import type { Snippet } from 'svelte';
interface Props {
    /** The region that responds to a right-click. */
    children: Snippet;
    /** Menu contents: `MenuItem`, `MenuSeparator`, anything. */
    menu: Snippet;
    open?: boolean;
    label?: string;
    disabled?: boolean;
    class?: string;
    menuClass?: string;
}
declare const ContextMenu: import("svelte").Component<Props, {}, "open">;
type ContextMenu = ReturnType<typeof ContextMenu>;
export default ContextMenu;
