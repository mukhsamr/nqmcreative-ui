import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
/** @deprecated use `Tone` — kept so existing `tone="brand" | "neutral"` still type-checks. */
export type BadgeTone = Tone;
export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
    variant?: BadgeVariant;
    size?: BadgeSize;
    /** Small filled circle before the label. */
    dot?: boolean;
    children: Snippet;
}
declare const Badge: import("svelte").Component<Props, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;
