import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
}
declare const AvatarGroup: import("svelte").Component<Props, {}, "">;
type AvatarGroup = ReturnType<typeof AvatarGroup>;
export default AvatarGroup;
