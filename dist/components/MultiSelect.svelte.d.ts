export interface MultiSelectOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    group?: string;
}
import { type Tone } from '../tones.js';
interface Props {
    /** Bindable — the `value` of every chosen option. */
    value?: string[];
    options: MultiSelectOption[];
    placeholder?: string;
    emptyText?: string;
    tone?: Tone;
    invalid?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    /** Cap on how many may be chosen. `0` means no limit. */
    max?: number;
    /** Collapse to "n selected" past this many chips. `0` shows them all. */
    maxChips?: number;
    id?: string;
    /** Submits one hidden input per value. */
    name?: string;
    onchange?: (value: string[]) => void;
    class?: string;
}
declare const MultiSelect: import("svelte").Component<Props, {}, "value">;
type MultiSelect = ReturnType<typeof MultiSelect>;
export default MultiSelect;
