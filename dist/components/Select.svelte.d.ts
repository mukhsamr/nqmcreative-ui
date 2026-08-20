import type { Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface Props extends HTMLSelectAttributes {
    value?: string;
    /** Data-driven options. Omit and pass `children` to write `<option>`s yourself. */
    options?: SelectOption[];
    placeholder?: string;
    tone?: Tone;
    invalid?: boolean;
    children?: Snippet;
}
declare const Select: import("svelte").Component<Props, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;
