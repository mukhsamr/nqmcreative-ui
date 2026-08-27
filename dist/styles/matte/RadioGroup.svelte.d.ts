import type { Snippet } from 'svelte';
import type { HTMLFieldsetAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
export interface RadioOption {
    value: string;
    label: string;
    /** Leading icon, 20px. Drawn in `boxed` mode only. */
    icon?: Snippet;
    description?: string;
    disabled?: boolean;
}
interface Props extends HTMLFieldsetAttributes {
    /** Bindable — the selected option's `value`. */
    value?: string;
    options?: RadioOption[];
    legend?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    tone?: Tone;
    orientation?: 'vertical' | 'horizontal';
    /** Wraps each option in a bordered, clickable card. */
    boxed?: boolean;
    /** Pass your own `Radio`s instead of `options`. */
    children?: Snippet;
}
declare const RadioGroup: import("svelte").Component<Props, {}, "value">;
type RadioGroup = ReturnType<typeof RadioGroup>;
export default RadioGroup;
