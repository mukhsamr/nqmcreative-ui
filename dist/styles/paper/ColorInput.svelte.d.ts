import type { HTMLInputAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
import { type InputSize } from './Input.svelte';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix' | 'type'> {
    /** Bindable `#rrggbb`. Shorthand and alpha are normalised away on blur. */
    value?: string;
    size?: InputSize;
    tone?: Tone;
    invalid?: boolean;
    /** Fixed choices under the field. Empty hides the row. */
    swatches?: string[];
    class?: string;
}
declare const ColorInput: import("svelte").Component<Props, {}, "value">;
type ColorInput = ReturnType<typeof ColorInput>;
export default ColorInput;
