import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    label?: string;
    /** Helper text under the control. Hidden while `error` is set. */
    hint?: string;
    /** Replaces the hint and turns it red. */
    error?: string;
    required?: boolean;
    /** `id` of the control — set the same value on the input inside. */
    for?: string;
    children: Snippet;
}
declare const Field: import("svelte").Component<Props, {}, "">;
type Field = ReturnType<typeof Field>;
export default Field;
