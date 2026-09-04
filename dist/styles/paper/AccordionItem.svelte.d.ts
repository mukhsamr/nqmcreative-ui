import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    open?: boolean;
    tone?: Tone;
    /** Short text on the right of the summary row. */
    meta?: string;
    /** Leading icon on the summary row. */
    icon?: Snippet;
    children: Snippet;
}
declare const AccordionItem: import("svelte").Component<Props, {}, "open">;
type AccordionItem = ReturnType<typeof AccordionItem>;
export default AccordionItem;
