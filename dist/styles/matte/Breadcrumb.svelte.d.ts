import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    /** Leading icon — a home mark on the first crumb, say. */
    icon?: Snippet;
}
interface Props extends HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    separator?: string;
    tone?: Tone;
}
declare const Breadcrumb: import("svelte").Component<Props, {}, "">;
type Breadcrumb = ReturnType<typeof Breadcrumb>;
export default Breadcrumb;
