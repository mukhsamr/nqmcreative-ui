import type { HTMLAttributes } from 'svelte/elements';
export type DividerOrientation = 'horizontal' | 'vertical';
interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: DividerOrientation;
    /** Centred caption drawn over a horizontal rule. */
    label?: string;
}
declare const Divider: import("svelte").Component<Props, {}, "">;
type Divider = ReturnType<typeof Divider>;
export default Divider;
