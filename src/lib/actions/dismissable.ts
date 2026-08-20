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

export function clickOutside(node: HTMLElement, options: ClickOutsideOptions = {}) {
	let opts = options;

	const handle = (event: PointerEvent) => {
		if (opts.enabled === false) return;
		const target = event.target as Node | null;
		if (!target || node.contains(target)) return;
		if (opts.ignore?.some((el) => el?.contains(target))) return;
		opts.onoutside?.();
	};

	// `pointerdown` rather than `click`, so a press that starts outside and ends
	// inside (a drag off a scrollbar, say) still counts as leaving.
	document.addEventListener('pointerdown', handle, true);

	return {
		update(next: ClickOutsideOptions) {
			opts = next;
		},
		destroy() {
			document.removeEventListener('pointerdown', handle, true);
		}
	};
}

const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/** Every focusable descendant, in tab order, skipping hidden ones. */
export function focusable(container: HTMLElement): HTMLElement[] {
	return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
		(el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
	);
}

export interface FocusTrapOptions {
	enabled?: boolean;
	/** Move focus into the overlay on mount. Default true. */
	autofocus?: boolean;
	/** Restore focus to whatever had it before. Default true. */
	restore?: boolean;
}

export function focusTrap(node: HTMLElement, options: FocusTrapOptions = {}) {
	let opts = { autofocus: true, restore: true, enabled: true, ...options };
	const previous = document.activeElement as HTMLElement | null;

	const handle = (event: KeyboardEvent) => {
		if (!opts.enabled || event.key !== 'Tab') return;
		const items = focusable(node);
		if (items.length === 0) {
			event.preventDefault();
			return;
		}
		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;

		if (event.shiftKey && (active === first || !node.contains(active))) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	};

	if (opts.enabled && opts.autofocus) {
		queueMicrotask(() => {
			if (node.contains(document.activeElement)) return;
			(focusable(node)[0] ?? node).focus();
		});
	}

	node.addEventListener('keydown', handle);

	return {
		update(next: FocusTrapOptions) {
			opts = { autofocus: true, restore: true, enabled: true, ...next };
		},
		destroy() {
			node.removeEventListener('keydown', handle);
			if (opts.restore && previous?.isConnected) previous.focus();
		}
	};
}

/** Moves the node to `document.body` (or any selector/element) on mount. */
export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
	let mount: HTMLElement | null = null;

	const attach = (to: HTMLElement | string) => {
		mount = typeof to === 'string' ? document.querySelector<HTMLElement>(to) : to;
		mount?.appendChild(node);
	};

	attach(target);

	return {
		update: attach,
		destroy() {
			node.remove();
		}
	};
}

/**
 * Roving focus for menus and listboxes: Arrow keys move, Home/End jump,
 * printable characters type-ahead. Returns whether the key was handled.
 */
export function navigateList(
	event: KeyboardEvent,
	items: HTMLElement[],
	options: { loop?: boolean } = {}
): boolean {
	if (items.length === 0) return false;
	const loop = options.loop ?? true;
	const index = items.indexOf(document.activeElement as HTMLElement);

	const focusAt = (next: number) => {
		const clamped = loop
			? (next + items.length) % items.length
			: Math.min(Math.max(0, next), items.length - 1);
		items[clamped]?.focus();
	};

	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			focusAt(index + 1);
			return true;
		case 'ArrowUp':
			event.preventDefault();
			focusAt(index - 1);
			return true;
		case 'Home':
			event.preventDefault();
			focusAt(0);
			return true;
		case 'End':
			event.preventDefault();
			focusAt(items.length - 1);
			return true;
	}

	if (event.key.length === 1 && /\S/.test(event.key) && !event.ctrlKey && !event.metaKey) {
		const needle = event.key.toLowerCase();
		const from = index + 1;
		const ordered = [...items.slice(from), ...items.slice(0, from)];
		const match = ordered.find((el) => el.textContent?.trim().toLowerCase().startsWith(needle));
		if (match) {
			event.preventDefault();
			match.focus();
			return true;
		}
	}

	return false;
}
