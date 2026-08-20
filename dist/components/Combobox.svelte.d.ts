import { type Tone } from '../tones.js';
export interface ComboboxOption {
    value: string;
    label: string;
    /** Second line under the label. */
    description?: string;
    disabled?: boolean;
    /** Options sharing a group are rendered under one heading. */
    group?: string;
}
interface Props {
    /** Bindable — the selected option's `value`, or `''`. */
    value?: string;
    options: ComboboxOption[];
    placeholder?: string;
    tone?: Tone;
    invalid?: boolean;
    disabled?: boolean;
    /** Shows a clear button once something is selected. */
    clearable?: boolean;
    emptyText?: string;
    id?: string;
    name?: string;
    onchange?: (value: string) => void;
    class?: string;
}
declare const Combobox: import("svelte").Component<Props, {}, "value">;
type Combobox = ReturnType<typeof Combobox>;
export default Combobox;
