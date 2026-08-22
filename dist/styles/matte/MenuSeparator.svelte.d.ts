import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Optional caption, rendered as a section heading above the rule. */
    label?: string;
}
declare const MenuSeparator: import("svelte").Component<Props, {}, "">;
type MenuSeparator = ReturnType<typeof MenuSeparator>;
export default MenuSeparator;
