import { type Tone } from '../tones.js';
interface Props {
    /** Bindable `YYYY-MM-DD`, or `''` for nothing selected. */
    value?: string;
    /** Bindable `YYYY-MM-DD` inside the month on show. */
    month?: string;
    /** Inclusive bounds, `YYYY-MM-DD`. */
    min?: string;
    max?: string;
    /** Return true to grey out a specific day — weekends, holidays. */
    isDisabled?: (date: Date) => boolean;
    /** 1 = Monday (default), 0 = Sunday. */
    weekStart?: 0 | 1;
    tone?: Tone;
    /** Show the "Today" shortcut under the grid. */
    showToday?: boolean;
    onselect?: (value: string) => void;
    class?: string;
}
declare const Calendar: import("svelte").Component<Props, {}, "month" | "value">;
type Calendar = ReturnType<typeof Calendar>;
export default Calendar;
