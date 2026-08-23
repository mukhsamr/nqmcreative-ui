import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max'> {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    tone?: Tone;
    label?: string;
    /** Prints the current value on the right of the label row. */
    showValue?: boolean;
    /** Appended to the printed value, e.g. `'%'`. */
    unit?: string;
    /** Tick labels under the track — usually just `[min, max]`. */
    marks?: (number | string)[];
}
declare const Slider: import("svelte").Component<Props, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
