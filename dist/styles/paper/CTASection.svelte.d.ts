import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type CTAVariant = 'tinted' | 'solid' | 'outline';
interface Props extends HTMLAttributes<HTMLElement> {
    title: string;
    description?: string;
    tone?: Tone;
    variant?: CTAVariant;
    /** Side by side on wide screens instead of stacked and centred. */
    inline?: boolean;
    /** The buttons. */
    actions?: Snippet;
    children?: Snippet;
}
declare const CTASection: import("svelte").Component<Props, {}, "">;
type CTASection = ReturnType<typeof CTASection>;
export default CTASection;
