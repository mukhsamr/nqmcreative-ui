import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    size?: SpinnerSize;
    /** Omit to inherit the parent's `currentColor` (e.g. inside a Button). */
    tone?: Tone;
    /** Defaults to `Loading`; pass `''` to hide it. */
    label?: string;
}
declare const Spinner: import("svelte").Component<Props, {}, "">;
type Spinner = ReturnType<typeof Spinner>;
export default Spinner;
