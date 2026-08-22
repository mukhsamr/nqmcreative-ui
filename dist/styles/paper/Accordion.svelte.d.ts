import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
}
declare const Accordion: import("svelte").Component<Props, {}, "">;
type Accordion = ReturnType<typeof Accordion>;
export default Accordion;
