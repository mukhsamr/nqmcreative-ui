import type { HTMLInputAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
import { type InputSize } from './Input.svelte';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix' | 'min' | 'max' | 'step'> {
    /** Bindable `HH:MM`, or `''` for empty. */
    value?: string;
    /** Inclusive bounds, `HH:MM`. */
    min?: string;
    max?: string;
    /** Minutes one press of a stepper moves, and what typing snaps to. */
    step?: number;
    size?: InputSize;
    tone?: Tone;
    invalid?: boolean;
    /** Hide the steppers and let the field be typed into only. */
    steppers?: boolean;
    class?: string;
}
declare const TimeInput: import("svelte").Component<Props, {}, "value">;
type TimeInput = ReturnType<typeof TimeInput>;
export default TimeInput;
