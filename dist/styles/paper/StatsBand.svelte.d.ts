import type { HTMLAttributes } from 'svelte/elements';
import type { StatTrend } from './Stat.svelte';
import type { Tone } from '../../core/tones.js';
export interface BandStat {
    label: string;
    value: string | number;
    delta?: string;
    trend?: StatTrend;
    hint?: string;
    tone?: Tone;
}
interface Props extends HTMLAttributes<HTMLElement> {
    stats: BandStat[];
    title?: string;
    /** Figures in one bordered card rather than free-standing. */
    bordered?: boolean;
}
declare const StatsBand: import("svelte").Component<Props, {}, "">;
type StatsBand = ReturnType<typeof StatsBand>;
export default StatsBand;
