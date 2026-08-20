import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../tones.js';
interface Props extends HTMLAttributes<HTMLDetailsElement> {
    title: string;
    open?: boolean;
    tone?: Tone;
    /** Short text on the right of the summary row. */
    meta?: string;
    children: Snippet;
}
declare const AccordionItem: import("svelte").Component<Props, {}, "open">;
type AccordionItem = ReturnType<typeof AccordionItem>;
export default AccordionItem;
