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
const defaults = {
    placement: 'bottom-start',
    offset: 6,
    padding: 8,
    matchWidth: false,
    enabled: true
};
function side(placement) {
    return placement.split('-')[0];
}
function align(placement) {
    return (placement.split('-')[1] ?? 'center');
}
function flip(placement) {
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    const a = align(placement);
    const next = opposite[side(placement)];
    return (a === 'center' ? next : `${next}-${a}`);
}
function fits(placement, anchorRect, w, h, gap) {
    switch (side(placement)) {
        case 'top':
            return anchorRect.top - gap - h >= 0;
        case 'bottom':
            return anchorRect.bottom + gap + h <= window.innerHeight;
        case 'left':
            return anchorRect.left - gap - w >= 0;
        case 'right':
            return anchorRect.right + gap + w <= window.innerWidth;
    }
}
export function anchored(node, options = {}) {
    let opts = { ...defaults, ...options };
    const place = () => {
        const anchor = opts.anchor;
        if (!opts.enabled || !anchor?.isConnected)
            return;
        const a = anchor.getBoundingClientRect();
        if (opts.matchWidth)
            node.style.width = `${a.width}px`;
        const { offsetWidth: w, offsetHeight: h } = node;
        const { offset: gap, padding: pad } = opts;
        let placement = opts.placement;
        if (!fits(placement, a, w, h, gap)) {
            const flipped = flip(placement);
            if (fits(flipped, a, w, h, gap))
                placement = flipped;
        }
        let top;
        let left;
        switch (side(placement)) {
            case 'top':
                top = a.top - h - gap;
                break;
            case 'bottom':
                top = a.bottom + gap;
                break;
            default:
                top = a.top + a.height / 2 - h / 2;
        }
        switch (side(placement)) {
            case 'left':
                left = a.left - w - gap;
                break;
            case 'right':
                left = a.right + gap;
                break;
            default:
                left = a.left + a.width / 2 - w / 2;
        }
        // cross-axis alignment for the top/bottom family
        if (side(placement) === 'top' || side(placement) === 'bottom') {
            if (align(placement) === 'start')
                left = a.left;
            else if (align(placement) === 'end')
                left = a.right - w;
        }
        // keep it on screen
        left = Math.min(Math.max(pad, left), Math.max(pad, window.innerWidth - w - pad));
        top = Math.min(Math.max(pad, top), Math.max(pad, window.innerHeight - h - pad));
        node.style.position = 'fixed';
        node.style.top = `${Math.round(top)}px`;
        node.style.left = `${Math.round(left)}px`;
        node.dataset.placement = placement;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(node);
    if (opts.anchor)
        observer.observe(opts.anchor);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return {
        update(next) {
            const previous = opts.anchor;
            opts = { ...defaults, ...next };
            if (previous !== opts.anchor) {
                if (previous)
                    observer.unobserve(previous);
                if (opts.anchor)
                    observer.observe(opts.anchor);
            }
            place();
        },
        destroy() {
            observer.disconnect();
            window.removeEventListener('scroll', place, true);
            window.removeEventListener('resize', place);
        }
    };
}
