import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string;
    alt?: string;
    /** Falls back to the initials of this name when there is no `src`. */
    name?: string;
    size?: AvatarSize;
    tone?: Tone;
    /** Square instead of the default circle. */
    squared?: boolean;
    /** Drawn instead of the initials when there is no `src` — a user mark. */
    fallback?: Snippet;
}
declare const Avatar: import("svelte").Component<Props, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
