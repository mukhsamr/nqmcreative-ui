import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends HTMLAttributes<HTMLElement> {
    /** Small line above the headline. */
    eyebrow?: string;
    title: string;
    description?: string;
    tone?: Tone;
    /** `center` also centres the actions. Ignored when `media` is set. */
    align?: 'left' | 'center';
    /** Buttons under the copy. */
    actions?: Snippet;
    /** Anything on the right — a screenshot, an illustration, a form. */
    media?: Snippet;
    /** Extra content between the description and the actions. */
    children?: Snippet;
}
declare const HeroSection: import("svelte").Component<Props, {}, "">;
type HeroSection = ReturnType<typeof HeroSection>;
export default HeroSection;
