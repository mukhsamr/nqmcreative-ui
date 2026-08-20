import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type TestimonialVariant = 'plain' | 'card' | 'accent';
interface Props extends HTMLAttributes<HTMLElement> {
    quote: string;
    author: string;
    role?: string;
    /** Avatar image. Falls back to the author's initials. */
    avatar?: string;
    tone?: Tone;
    variant?: TestimonialVariant;
    /** Bigger type, for a single pull quote. */
    large?: boolean;
    children?: Snippet;
}
declare const Testimonial: import("svelte").Component<Props, {}, "">;
type Testimonial = ReturnType<typeof Testimonial>;
export default Testimonial;
