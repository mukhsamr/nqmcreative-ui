import type { HTMLInputAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
    value?: string;
    tone?: Tone;
    invalid?: boolean;
    /** Draws a four-segment strength meter under the field. */
    strength?: boolean;
}
declare const PasswordInput: import("svelte").Component<Props, {}, "value">;
type PasswordInput = ReturnType<typeof PasswordInput>;
export default PasswordInput;
