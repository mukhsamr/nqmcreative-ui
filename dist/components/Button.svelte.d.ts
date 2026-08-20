import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'primary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
interface Props extends HTMLButtonAttributes {
    variant?: ButtonVariant;
    tone?: Tone;
    size?: ButtonSize;
    /** Renders an `<a>` instead of a `<button>`. */
    href?: string;
    target?: string;
    rel?: string;
    loading?: boolean;
    /** Stretch to the container's full width. */
    block?: boolean;
    children: Snippet;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
