import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Children sit flush against each other with shared hairlines —
     *  an Input plus a Button, a Select plus an Input, and so on. */
    children: Snippet;
}
declare const InputGroup: import("svelte").Component<Props, {}, "">;
type InputGroup = ReturnType<typeof InputGroup>;
export default InputGroup;
