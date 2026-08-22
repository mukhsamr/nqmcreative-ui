import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    tone?: Tone;
    /** Turns the whole card into a link. */
    href?: string;
    /** Glyph inside the tinted square. */
    icon?: Snippet;
    children?: Snippet;
}
declare const FeatureCard: import("svelte").Component<Props, {}, "">;
type FeatureCard = ReturnType<typeof FeatureCard>;
export default FeatureCard;
