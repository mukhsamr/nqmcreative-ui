import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type CardVariant = 'outline' | 'filled' | 'tinted';
interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    tone?: Tone;
    /** Draws a tone-coloured rule down the left edge. */
    accent?: boolean;
    /** Lifts the card on hover — use for clickable cards. */
    interactive?: boolean;
    padded?: boolean;
    title?: string;
    eyebrow?: string;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
}
declare const Card: import("svelte").Component<Props, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;
