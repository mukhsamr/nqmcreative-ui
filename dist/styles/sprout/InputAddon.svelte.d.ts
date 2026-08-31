import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { InputSize } from './Input.svelte';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Match the Input it sits beside — the heights have to agree. */
    size?: InputSize;
    /** Paint it like a field instead of a fixed label. */
    variant?: 'muted' | 'plain';
    children: Snippet;
}
declare const InputAddon: import("svelte").Component<Props, {}, "">;
type InputAddon = ReturnType<typeof InputAddon>;
export default InputAddon;
