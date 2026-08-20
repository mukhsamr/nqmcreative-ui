export interface StepItem {
    label: string;
    description?: string;
    /** Marks the step as failed — shown in `danger` regardless of position. */
    error?: boolean;
    disabled?: boolean;
}
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
    items: StepItem[];
    /** Bindable, zero-based. Steps before it count as done. */
    current?: number;
    orientation?: 'horizontal' | 'vertical';
    tone?: Tone;
    /** Let the user jump to a completed step by clicking it. */
    clickable?: boolean;
    /** Hide the connecting rule between steps. */
    bare?: boolean;
    onchange?: (index: number) => void;
}
declare const Steps: import("svelte").Component<Props, {}, "current">;
type Steps = ReturnType<typeof Steps>;
export default Steps;
