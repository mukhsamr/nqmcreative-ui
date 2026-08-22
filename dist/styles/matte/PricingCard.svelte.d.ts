import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    name: string;
    /** Already formatted — the component does not do currency. */
    price: string;
    /** `/ month`, `per seat`, whatever follows the figure. */
    period?: string;
    description?: string;
    /** One line each. Rendered with a tick. */
    features?: string[];
    /** Pill in the top corner, e.g. "Most popular". */
    badge?: string;
    /** Thicker border and a tinted header — for the plan you want chosen. */
    featured?: boolean;
    tone?: Tone;
    /** The button. */
    action?: Snippet;
    /** Extra content under the feature list. */
    children?: Snippet;
}
declare const PricingCard: import("svelte").Component<Props, {}, "">;
type PricingCard = ReturnType<typeof PricingCard>;
export default PricingCard;
