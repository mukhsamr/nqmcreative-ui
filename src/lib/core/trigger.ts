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
export const HOVER_GRACE = 120;

export function popupTrigger(node: HTMLElement, options: PopupTriggerOptions) {
	let opts = options;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const onClick = () => opts.toggle();
	const onShow = () => {
		clearTimeout(timer);
		opts.open();
	};
	const onHide = () => {
		timer = setTimeout(() => opts.close(), HOVER_GRACE);
	};
	const onKeydown = (event: KeyboardEvent) => {
		if (!opts.arrowOpens || event.key !== 'ArrowDown') return;
		if (opts.isOpen?.()) return;
		event.preventDefault();
		opts.open();
	};

	const bind = () => {
		if (opts.on === 'hover') {
			node.addEventListener('pointerenter', onShow);
			node.addEventListener('pointerleave', onHide);
			node.addEventListener('focusin', onShow);
			node.addEventListener('focusout', onHide);
		} else {
			node.addEventListener('click', onClick);
			node.addEventListener('keydown', onKeydown);
		}
	};

	const unbind = () => {
		node.removeEventListener('click', onClick);
		node.removeEventListener('keydown', onKeydown);
		node.removeEventListener('pointerenter', onShow);
		node.removeEventListener('pointerleave', onHide);
		node.removeEventListener('focusin', onShow);
		node.removeEventListener('focusout', onHide);
	};

	bind();

	return {
		update(next: PopupTriggerOptions) {
			unbind();
			opts = next;
			bind();
		},
		destroy() {
			clearTimeout(timer);
			unbind();
		}
	};
}

/**
 * Puts `aria-haspopup`/`aria-expanded` on the real control inside a trigger
 * wrapper, so screen readers announce the state on the thing being pressed.
 */
export function describeTrigger(
	wrapper: HTMLElement | null,
	kind: 'menu' | 'dialog' | 'listbox',
	open: boolean
) {
	const control = wrapper?.querySelector('button, a, [role="button"]');
	if (!control) return;
	control.setAttribute('aria-haspopup', kind);
	control.setAttribute('aria-expanded', String(open));
}

/** The menu items a roving-focus menu should walk, in DOM order. */
export function menuItems(menu: HTMLElement | null): HTMLElement[] {
	return menu ? [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')] : [];
}
