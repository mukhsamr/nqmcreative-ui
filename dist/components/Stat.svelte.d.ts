import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type StatTrend = 'up' | 'down' | 'flat';
interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    /** Secondary figure, e.g. `'+12.4%'`. */
    delta?: string;
    trend?: StatTrend;
    hint?: string;
    /** Colour of the value itself. Leave unset for plain `text`. */
    tone?: Tone;
}
declare const Stat: import("svelte").Component<Props, {}, "">;
type Stat = ReturnType<typeof Stat>;
export default Stat;
