/**
 * Wiring for a popup's trigger.
 *
 * Dropdown and Popover take the trigger as a snippet, so the real control is
 * whatever the consumer passed — a Button, a link, an avatar. Rather than wrap
 * it in another button (which would nest interactive elements and put the ARIA
 * state on the wrong node), these attach to the element that is already there.
 */
export interface PopupTriggerOptions {
    /** Flip the popup open/closed. */
    toggle: () => void;
    /** Open it — used by ArrowDown and by hover triggers. */
    open: () => void;
    /** Close it, after the grace period a hover trigger needs. */
    close: () => void;
    /** `'hover'` also responds to focus, for read-only content. */
    on?: 'click' | 'hover';
    /** Open on ArrowDown while closed — menu behaviour. */
    arrowOpens?: boolean;
    /** Whether the popup is currently open, read at event time. */
    isOpen?: () => boolean;
}
/** Milliseconds a hover popup stays up after the pointer leaves. */
export declare const HOVER_GRACE = 120;
export declare function popupTrigger(node: HTMLElement, options: PopupTriggerOptions): {
    update(next: PopupTriggerOptions): void;
    destroy(): void;
};
/**
 * Puts `aria-haspopup`/`aria-expanded` on the real control inside a trigger
 * wrapper, so screen readers announce the state on the thing being pressed.
 */
export declare function describeTrigger(wrapper: HTMLElement | null, kind: 'menu' | 'dialog' | 'listbox', open: boolean): void;
/** The menu items a roving-focus menu should walk, in DOM order. */
export declare function menuItems(menu: HTMLElement | null): HTMLElement[];
