import { type DateFormat } from '../../core/date.js';
import { type Tone } from '../../core/tones.js';
interface Props {
    /** Bindable `YYYY-MM-DD` — the same shape as `<input type="date">`. */
    value?: string;
    /** Inclusive bounds, `YYYY-MM-DD`. */
    min?: string;
    max?: string;
    isDisabled?: (date: Date) => boolean;
    weekStart?: 0 | 1;
    /** Order of the date parts the field accepts and prints. */
    format?: DateFormat;
    tone?: Tone;
    invalid?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    placeholder?: string;
    id?: string;
    /** Submits the ISO value with a form. */
    name?: string;
    onchange?: (value: string) => void;
    class?: string;
}
declare const DatePicker: import("svelte").Component<Props, {}, "value">;
type DatePicker = ReturnType<typeof DatePicker>;
export default DatePicker;
