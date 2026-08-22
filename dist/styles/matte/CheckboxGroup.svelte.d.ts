import type { Snippet } from 'svelte';
import type { HTMLFieldsetAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
export interface CheckboxOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
interface Props extends Omit<HTMLFieldsetAttributes, 'onchange'> {
    /** Bindable — the `value` of every checked option. */
    value?: string[];
    options?: CheckboxOption[];
    legend?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    tone?: Tone;
    orientation?: 'vertical' | 'horizontal';
    /** Wraps each option in a bordered, clickable card. */
    boxed?: boolean;
    /** Cap on how many may be checked at once. `0` means no limit. */
    max?: number;
    onchange?: (value: string[]) => void;
    /** Pass your own `Checkbox`es instead of `options`. */
    children?: Snippet;
}
declare const CheckboxGroup: import("svelte").Component<Props, {}, "value">;
type CheckboxGroup = ReturnType<typeof CheckboxGroup>;
export default CheckboxGroup;
