import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends HTMLAnchorAttributes {
    tone?: Tone;
    /** `'hover'` shows the rule only on hover. */
    underline?: 'always' | 'hover' | 'none';
    /** Adds `target="_blank" rel="noreferrer"` and an arrow glyph. */
    external?: boolean;
    /** Inherit the surrounding text colour instead of the tone. */
    muted?: boolean;
    /** Leading icon, 14px. */
    icon?: Snippet;
    /** Trailing icon, before the external mark. */
    iconEnd?: Snippet;
    children: Snippet;
}
declare const Link: import("svelte").Component<Props, {}, "">;
type Link = ReturnType<typeof Link>;
export default Link;
