export interface NavItem {
    label: string;
    href?: string;
    /** Leading icon, 16px. */
    icon?: Snippet;
    /** Marks the current page — also sets `aria-current`. */
    active?: boolean;
    disabled?: boolean;
    /** Renders a dropdown instead of a plain link. */
    items?: NavItem[];
    /** Small count or tag after the label. */
    badge?: string | number;
}
import type { Snippet } from 'svelte';
import { type Tone } from '../../core/tones.js';
interface Props {
    items?: NavItem[];
    /** Logo or wordmark on the left. */
    brand?: Snippet;
    /** Buttons on the right — sign in, theme toggle, avatar. */
    actions?: Snippet;
    /** Extra content inside the mobile drawer, under the links. */
    mobileExtra?: Snippet;
    tone?: Tone;
    /** Sticks to the top of the viewport. */
    sticky?: boolean;
    /** Hairline along the bottom edge. Default true. */
    bordered?: boolean;
    /** Bindable — the mobile drawer's state. */
    menuOpen?: boolean;
    class?: string;
}
declare const Navbar: import("svelte").Component<Props, {}, "menuOpen">;
type Navbar = ReturnType<typeof Navbar>;
export default Navbar;
