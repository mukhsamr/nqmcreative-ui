/**
 * Behaviour shared by every dismissable overlay: click outside, Escape, focus
 * containment, and returning focus where it came from.
 *
 * They live in one file because overlays always need them together, and the
 * ordering between them matters — Escape must beat click-outside, and focus is
 * only returned once, on teardown.
 */
export interface ClickOutsideOptions {
    /** Fires when a pointer goes down outside the node. */
    onoutside?: () => void;
    /** Elements that should not count as "outside" — usually the trigger. */
    ignore?: (HTMLElement | null | undefined)[];
    enabled?: boolean;
}
export declare function clickOutside(node: HTMLElement, options?: ClickOutsideOptions): {
    update(next: ClickOutsideOptions): void;
    destroy(): void;
};
/** Every focusable descendant, in tab order, skipping hidden ones. */
export declare function focusable(container: HTMLElement): HTMLElement[];
export interface FocusTrapOptions {
    enabled?: boolean;
    /** Move focus into the overlay on mount. Default true. */
    autofocus?: boolean;
    /** Restore focus to whatever had it before. Default true. */
    restore?: boolean;
}
export declare function focusTrap(node: HTMLElement, options?: FocusTrapOptions): {
    update(next: FocusTrapOptions): void;
    destroy(): void;
};
/** Moves the node to `document.body` (or any selector/element) on mount. */
export declare function portal(node: HTMLElement, target?: HTMLElement | string): {
    update: (to: HTMLElement | string) => void;
    destroy(): void;
};
/**
 * Roving focus for menus and listboxes: Arrow keys move, Home/End jump,
 * printable characters type-ahead. Returns whether the key was handled.
 */
export declare function navigateList(event: KeyboardEvent, items: HTMLElement[], options?: {
    loop?: boolean;
}): boolean;
