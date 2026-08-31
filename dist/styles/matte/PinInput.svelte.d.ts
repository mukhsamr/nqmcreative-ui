import { type PinMode } from '../../core/pin.js';
import { type Tone } from '../../core/tones.js';
interface Props {
    /** Bindable code. Shorter than `length` means still incomplete. */
    value?: string;
    /** How many boxes. */
    length?: number;
    /** What a box accepts. */
    mode?: PinMode;
    /** Render the characters as dots. */
    mask?: boolean;
    /** Draw a gap after this many boxes — `3` gives `123 456`. */
    groupAfter?: number;
    disabled?: boolean;
    invalid?: boolean;
    tone?: Tone;
    /** `name` for a plain form submit — one hidden field holding the code. */
    name?: string;
    /** Fires once the last box is filled. */
    oncomplete?: (value: string) => void;
    class?: string;
}
declare const PinInput: import("svelte").Component<Props, {}, "value">;
type PinInput = ReturnType<typeof PinInput>;
export default PinInput;
