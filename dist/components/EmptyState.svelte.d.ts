import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    tone?: Tone;
    /** Glyph inside the tinted circle. Defaults to a plain outline. */
    icon?: Snippet;
    /** Buttons or links under the copy. */
    action?: Snippet;
    /** Draws a dashed placeholder border around the block. */
    bordered?: boolean;
    children?: Snippet;
}
declare const EmptyState: import("svelte").Component<Props, {}, "">;
type EmptyState = ReturnType<typeof EmptyState>;
export default EmptyState;
