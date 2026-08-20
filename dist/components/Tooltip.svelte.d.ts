import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Tooltip text. CSS-only: shows on hover and on keyboard focus. */
    content: string;
    placement?: TooltipPlacement;
    children: Snippet;
}
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
