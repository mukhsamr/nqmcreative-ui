import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
    checked?: boolean;
    /** Renders the dash state — visual only, `checked` stays false. */
    indeterminate?: boolean;
    label?: string;
    description?: string;
    tone?: Tone;
    children?: Snippet;
}
declare const Checkbox: import("svelte").Component<Props, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
