import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
export interface Logo {
    name: string;
    src?: string;
    href?: string;
}
interface Props extends HTMLAttributes<HTMLElement> {
    title?: string;
    /** Without `src` the name is set in the heading face — fine for wordmarks. */
    logos?: Logo[];
    /** Dim until hovered, so the row does not compete with the headline. */
    muted?: boolean;
    /** Your own markup instead of `logos`. */
    children?: Snippet;
}
declare const LogoCloud: import("svelte").Component<Props, {}, "">;
type LogoCloud = ReturnType<typeof LogoCloud>;
export default LogoCloud;
