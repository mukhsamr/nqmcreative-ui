import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
    /** Small count/label rendered after the tab title. */
    badge?: string | number;
}
export type TabsVariant = 'underline' | 'pill' | 'segmented';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    items: TabItem[];
    /** Bindable — the `value` of the active tab. */
    value?: string;
    variant?: TabsVariant;
    tone?: Tone;
    /** Spread tabs evenly across the full width. */
    fullWidth?: boolean;
    onchange?: (value: string) => void;
}
declare const Tabs: import("svelte").Component<Props, {}, "value">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
