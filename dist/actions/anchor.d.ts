/**
 * Positions a floating element against an anchor, without a dependency.
 *
 * The element is taken out of flow (`position: fixed`) so it never gets clipped
 * by an ancestor's `overflow: hidden`, then placed on the requested side. If it
 * doesn't fit there it flips to the opposite side; if it still overhangs, it is
 * clamped inside the viewport with `padding` to spare.
 *
 * Re-runs on scroll (capture phase, so nested scrollers count), on resize, and
 * whenever the anchor or the element itself changes size.
 */
export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
export interface AnchorOptions {
    /** The element to position against. */
    anchor?: HTMLElement | null;
    placement?: Placement;
    /** Gap between anchor and element, in px. */
    offset?: number;
    /** Minimum distance to the viewport edge, in px. */
    padding?: number;
    /** Force the element to the anchor's width — dropdown menus, comboboxes. */
    matchWidth?: boolean;
    /** Skip all work while false (the element is usually not rendered then). */
    enabled?: boolean;
}
export declare function anchored(node: HTMLElement, options?: AnchorOptions): {
    update(next: AnchorOptions): void;
    destroy(): void;
};
