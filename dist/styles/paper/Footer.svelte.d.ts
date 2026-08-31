export interface FooterLink {
    label: string;
    href?: string;
    /** Leading icon, 14px. */
    icon?: Snippet;
    external?: boolean;
}
export interface FooterColumn {
    title: string;
    links: FooterLink[];
}
import type { Snippet } from 'svelte';
import { type Tone } from '../../core/tones.js';
interface Props {
    columns?: FooterColumn[];
    /** Logo, wordmark and a line of copy on the left. */
    brand?: Snippet;
    /** Right side of the bottom bar — social links, a language picker. */
    bottom?: Snippet;
    /** Left side of the bottom bar. Ignored when `bottom` covers both. */
    copyright?: string;
    tone?: Tone;
    class?: string;
}
declare const Footer: import("svelte").Component<Props, {}, "">;
type Footer = ReturnType<typeof Footer>;
export default Footer;
