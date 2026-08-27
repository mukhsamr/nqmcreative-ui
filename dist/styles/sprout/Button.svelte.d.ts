import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'primary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
interface Props extends Omit<HTMLButtonAttributes, 'onclick'> {
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
    /** Leading icon. The spinner takes its place while the button is busy. */
    icon?: Snippet;
    /** Trailing icon. */
    iconEnd?: Snippet;
    /** Square button with no label — pass an `aria-label`. */
    iconOnly?: boolean;
    /**
     * Return a promise — a save, a submit, a fetch — and the button spins and
     * locks itself until it settles, without any state in the parent. It
     * unlocks on a rejection too, so catch failures inside the handler.
     */
    onclick?: (event: MouseEvent) => unknown;
    children?: Snippet;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
