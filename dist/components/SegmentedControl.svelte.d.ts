import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export interface SegmentOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export type SegmentedSize = 'sm' | 'md';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** Bindable — the selected option's `value`. */
    value?: string;
    options: SegmentOption[];
    /** Submits with a form when set. */
    name?: string;
    size?: SegmentedSize;
    tone?: Tone;
    /** Spread the segments evenly across the full width. */
    fullWidth?: boolean;
    label?: string;
    disabled?: boolean;
    onchange?: (value: string) => void;
}
declare const SegmentedControl: import("svelte").Component<Props, {}, "value">;
type SegmentedControl = ReturnType<typeof SegmentedControl>;
export default SegmentedControl;
