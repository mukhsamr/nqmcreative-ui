import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
}
declare const Kbd: import("svelte").Component<Props, {}, "">;
type Kbd = ReturnType<typeof Kbd>;
export default Kbd;
