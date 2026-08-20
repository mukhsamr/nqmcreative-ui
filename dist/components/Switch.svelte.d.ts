import type { HTMLButtonAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type SwitchSize = 'sm' | 'md';
interface Props extends Omit<HTMLButtonAttributes, 'onclick' | 'onchange'> {
    checked?: boolean;
    label?: string;
    description?: string;
    tone?: Tone;
    size?: SwitchSize;
    onchange?: (checked: boolean) => void;
}
declare const Switch: import("svelte").Component<Props, {}, "checked">;
type Switch = ReturnType<typeof Switch>;
export default Switch;
