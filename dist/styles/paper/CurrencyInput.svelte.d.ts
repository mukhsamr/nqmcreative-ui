import type { HTMLInputAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
import { type InputSize } from './Input.svelte';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'suffix' | 'value' | 'min' | 'max'> {
    /** Bindable amount. `null` is an empty field, which is not the same as 0. */
    value?: number | null;
    min?: number;
    max?: number;
    /** Thousands separator. */
    group?: string;
    /** Decimal separator. */
    decimal?: string;
    /** Decimal places the amount settles to when the field loses focus. */
    precision?: number;
    /** Leading mark — `Rp`, `$`, `€`. */
    currency?: string;
    /** Trailing mark instead, for the locales that write it that way. */
    unit?: string;
    size?: InputSize;
    tone?: Tone;
    invalid?: boolean;
    class?: string;
}
declare const CurrencyInput: import("svelte").Component<Props, {}, "value">;
type CurrencyInput = ReturnType<typeof CurrencyInput>;
export default CurrencyInput;
