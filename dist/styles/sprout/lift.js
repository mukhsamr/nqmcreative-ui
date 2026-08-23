/** Barely raised: chips, inputs, table headers, anything sitting on a page. */
export const edge = 'shadow-[0_2px_0_0_rgba(20,83,45,0.07)]';
/** The workhorse: cards, menus, popovers. A 4px lip plus a wide, soft drop. */
export const soft = 'shadow-[0_4px_0_0_rgba(20,83,45,0.08),0_14px_30px_-10px_rgba(20,83,45,0.18)]';
/** `soft`, one step deeper, for a card that rises under the pointer. */
export const softOnHover = 'hover:shadow-[0_6px_0_0_rgba(20,83,45,0.10),0_18px_36px_-12px_rgba(20,83,45,0.22)]';
/** Off the page entirely: modals, drawers, the command palette. */
export const float = 'shadow-[0_6px_0_0_rgba(20,83,45,0.09),0_28px_60px_-20px_rgba(20,83,45,0.35)]';
/**
 * A solid fill's own lip: the tone mixed most of the way to black, so it is
 * always the same colour a shadow of that fill would be. Pair with
 * `active:translate-y-[3px]` — the button travels down exactly as far as the
 * lip shortens, so the top face lands where the shadow was and the whole thing
 * reads as one pressed object.
 */
export const lift = {
    brand: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-brand)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-brand)_72%,black)]',
    accent: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-accent)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-accent)_72%,black)]',
    violet: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-violet)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-violet)_72%,black)]',
    info: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-info)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-info)_72%,black)]',
    success: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-success)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-success)_72%,black)]',
    warning: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-warning)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-warning)_72%,black)]',
    danger: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-danger)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-danger)_72%,black)]',
    neutral: 'shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-neutral)_72%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-neutral)_72%,black)]'
};
/** The same lip at 3px, for things too small to travel: icon tiles, dots. */
export const liftSm = {
    brand: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-brand)_72%,black)]',
    accent: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-accent)_72%,black)]',
    violet: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-violet)_72%,black)]',
    info: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-info)_72%,black)]',
    success: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-success)_72%,black)]',
    warning: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-warning)_72%,black)]',
    danger: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-danger)_72%,black)]',
    neutral: 'shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-neutral)_72%,black)]'
};
