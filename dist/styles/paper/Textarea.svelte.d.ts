import type { HTMLTextareaAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends HTMLTextareaAttributes {
    value?: string;
    tone?: Tone;
    invalid?: boolean;
    /** Grow with the content instead of showing a scrollbar. */
    autoresize?: boolean;
}
declare const Textarea: import("svelte").Component<Props, {}, "value">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;
