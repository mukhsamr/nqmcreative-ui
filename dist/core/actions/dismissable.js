/**
 * Behaviour shared by every dismissable overlay: click outside, Escape, focus
 * containment, and returning focus where it came from.
 *
 * They live in one file because overlays always need them together, and the
 * ordering between them matters — Escape must beat click-outside, and focus is
 * only returned once, on teardown.
 */
export function clickOutside(node, options = {}) {
    let opts = options;
    const handle = (event) => {
        if (opts.enabled === false)
            return;
        const target = event.target;
        if (!target || node.contains(target))
            return;
        if (opts.ignore?.some((el) => el?.contains(target)))
            return;
        opts.onoutside?.();
    };
    // `pointerdown` rather than `click`, so a press that starts outside and ends
    // inside (a drag off a scrollbar, say) still counts as leaving.
    document.addEventListener('pointerdown', handle, true);
    return {
        update(next) {
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
export function focusable(container) {
    return [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
}
export function focusTrap(node, options = {}) {
    let opts = { autofocus: true, restore: true, enabled: true, ...options };
    const previous = document.activeElement;
    const handle = (event) => {
        if (!opts.enabled || event.key !== 'Tab')
            return;
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
        }
        else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };
    if (opts.enabled && opts.autofocus) {
        queueMicrotask(() => {
            if (node.contains(document.activeElement))
                return;
            (focusable(node)[0] ?? node).focus();
        });
    }
    node.addEventListener('keydown', handle);
    return {
        update(next) {
            opts = { autofocus: true, restore: true, enabled: true, ...next };
        },
        destroy() {
            node.removeEventListener('keydown', handle);
            if (opts.restore && previous?.isConnected)
                previous.focus();
        }
    };
}
/** Moves the node to `document.body` (or any selector/element) on mount. */
export function portal(node, target = 'body') {
    let mount = null;
    const attach = (to) => {
        mount = typeof to === 'string' ? document.querySelector(to) : to;
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
export function navigateList(event, items, options = {}) {
    if (items.length === 0)
        return false;
    const loop = options.loop ?? true;
    const index = items.indexOf(document.activeElement);
    const focusAt = (next) => {
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
