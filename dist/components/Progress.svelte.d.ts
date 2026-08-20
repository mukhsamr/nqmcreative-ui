import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type ProgressSize = 'sm' | 'md' | 'lg';
interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    tone?: Tone;
    size?: ProgressSize;
    label?: string;
    /** Prints the percentage on the right of the label row. */
    showValue?: boolean;
    /** Ignores `value` and runs a looping sweep. */
    indeterminate?: boolean;
}
declare const Progress: import("svelte").Component<Props, {}, "">;
type Progress = ReturnType<typeof Progress>;
export default Progress;
