import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends HTMLButtonAttributes {
    /** Renders an `<a>` instead of a `<button>`. */
    href?: string;
    tone?: Tone;
    /** Leading glyph. */
    icon?: Snippet;
    /** Right-aligned hint — a keyboard shortcut, a count. */
    shortcut?: string;
    /** Shows a check on the left and marks the item as chosen. */
    selected?: boolean;
    children: Snippet;
}
declare const MenuItem: import("svelte").Component<Props, {}, "">;
type MenuItem = ReturnType<typeof MenuItem>;
export default MenuItem;
