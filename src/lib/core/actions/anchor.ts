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

export type Placement =
	'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

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

const defaults = {
	placement: 'bottom-start' as Placement,
	offset: 6,
	padding: 8,
	matchWidth: false,
	enabled: true
};

function side(placement: Placement) {
	return placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
}

function align(placement: Placement) {
	return (placement.split('-')[1] ?? 'center') as 'start' | 'end' | 'center';
}

function flip(placement: Placement): Placement {
	const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
	const a = align(placement);
	const next = opposite[side(placement)];
	return (a === 'center' ? next : `${next}-${a}`) as Placement;
}

function fits(placement: Placement, anchorRect: DOMRect, w: number, h: number, gap: number) {
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

export function anchored(node: HTMLElement, options: AnchorOptions = {}) {
	let opts = { ...defaults, ...options };

	const place = () => {
		const anchor = opts.anchor;
		if (!opts.enabled || !anchor?.isConnected) return;

		const a = anchor.getBoundingClientRect();
		if (opts.matchWidth) node.style.width = `${a.width}px`;

		const { offsetWidth: w, offsetHeight: h } = node;
		const { offset: gap, padding: pad } = opts;

		let placement = opts.placement;
		if (!fits(placement, a, w, h, gap)) {
			const flipped = flip(placement);
			if (fits(flipped, a, w, h, gap)) placement = flipped;
		}

		let top: number;
		let left: number;

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
			if (align(placement) === 'start') left = a.left;
			else if (align(placement) === 'end') left = a.right - w;
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
	if (opts.anchor) observer.observe(opts.anchor);

	window.addEventListener('scroll', place, true);
	window.addEventListener('resize', place);

	return {
		update(next: AnchorOptions) {
			const previous = opts.anchor;
			opts = { ...defaults, ...next };
			if (previous !== opts.anchor) {
				if (previous) observer.unobserve(previous);
				if (opts.anchor) observer.observe(opts.anchor);
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
