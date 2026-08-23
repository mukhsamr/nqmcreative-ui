/**
 * sprout's shadows — a hard lip rather than a blur.
 *
 * The style's one structural idea: every raised thing sits on a solid edge in
 * its own colour, the way a printed sticker or a moulded key does. A blurred
 * drop shadow alone reads as glass; a flat offset reads as a physical object a
 * child could press, which is the whole point of the style.
 *
 * Kept here rather than in `theme.css` because the token *names* are a contract
 * shared by every style — a `--shadow-lip` that only sprout defined would fail
 * `bun run scoped`. These are plain class strings instead, style-local by
 * construction, and Tailwind sees them because it scans this file like any
 * other source.
 *
 * No `dark:` anywhere, deliberately. Dark mode arrives two ways — an explicit
 * `.dark` class *and* a bare OS preference — and the `dark:` variant only knows
 * about the first, so a component that leant on it would be right half the
 * time. Everything below is instead written to hold in both modes: the surface
 * shadows are near-black at low alpha, and a tone's lip is mixed from the tone
 * itself, so it darkens whatever the fill happens to be.
 */
import type { Tone } from '../../core/tones.js';
/** Barely raised: chips, inputs, table headers, anything sitting on a page. */
export declare const edge = "shadow-[0_2px_0_0_rgba(20,83,45,0.07)]";
/** The workhorse: cards, menus, popovers. A 4px lip plus a wide, soft drop. */
export declare const soft = "shadow-[0_4px_0_0_rgba(20,83,45,0.08),0_14px_30px_-10px_rgba(20,83,45,0.18)]";
/** `soft`, one step deeper, for a card that rises under the pointer. */
export declare const softOnHover = "hover:shadow-[0_6px_0_0_rgba(20,83,45,0.10),0_18px_36px_-12px_rgba(20,83,45,0.22)]";
/** Off the page entirely: modals, drawers, the command palette. */
export declare const float = "shadow-[0_6px_0_0_rgba(20,83,45,0.09),0_28px_60px_-20px_rgba(20,83,45,0.35)]";
/**
 * A solid fill's own lip: the tone mixed most of the way to black, so it is
 * always the same colour a shadow of that fill would be. Pair with
 * `active:translate-y-[3px]` — the button travels down exactly as far as the
 * lip shortens, so the top face lands where the shadow was and the whole thing
 * reads as one pressed object.
 */
export declare const lift: Record<Tone, string>;
/** The same lip at 3px, for things too small to travel: icon tiles, dots. */
export declare const liftSm: Record<Tone, string>;
