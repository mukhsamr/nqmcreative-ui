import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
    variant?: BadgeVariant;
    size?: BadgeSize;
    /** Small filled circle before the label. */
    dot?: boolean;
    /** Leading icon, 14px — sits where the dot would. */
    icon?: Snippet;
    children: Snippet;
}
declare const Badge: import("svelte").Component<Props, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;
