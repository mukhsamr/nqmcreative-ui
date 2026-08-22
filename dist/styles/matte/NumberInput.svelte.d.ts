import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max'> {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    tone?: Tone;
    invalid?: boolean;
    /** Short unit rendered inside the field, e.g. `'px'` or `'%'`. */
    unit?: string;
}
declare const NumberInput: import("svelte").Component<Props, {}, "value">;
type NumberInput = ReturnType<typeof NumberInput>;
export default NumberInput;
