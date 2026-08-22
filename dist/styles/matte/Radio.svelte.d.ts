import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
    /** Bind the same variable across a set of radios. */
    group?: string;
    value: string;
    label?: string;
    description?: string;
    tone?: Tone;
    children?: Snippet;
}
declare const Radio: import("svelte").Component<Props, {}, "group">;
type Radio = ReturnType<typeof Radio>;
export default Radio;
