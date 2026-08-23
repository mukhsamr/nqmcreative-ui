import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type InputSize = 'sm' | 'md' | 'lg';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix'> {
    value?: string;
    size?: InputSize;
    tone?: Tone;
    /** Paints the field red and sets `aria-invalid`. */
    invalid?: boolean;
    /** Leading adornment — an icon, a currency symbol, `https://` … */
    prefix?: Snippet;
    /** Trailing adornment. */
    suffix?: Snippet;
}
declare const Input: import("svelte").Component<Props, {}, "value">;
type Input = ReturnType<typeof Input>;
export default Input;
