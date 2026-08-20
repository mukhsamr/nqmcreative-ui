import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type AlertVariant = 'soft' | 'outline' | 'accent';
interface Props extends HTMLAttributes<HTMLDivElement> {
    tone?: Tone;
    variant?: AlertVariant;
    title?: string;
    /** Shows a close button and fires `ondismiss`. */
    dismissible?: boolean;
    ondismiss?: () => void;
    /** Replaces the built-in status glyph. */
    icon?: Snippet;
    children?: Snippet;
}
declare const Alert: import("svelte").Component<Props, {}, "">;
type Alert = ReturnType<typeof Alert>;
export default Alert;
