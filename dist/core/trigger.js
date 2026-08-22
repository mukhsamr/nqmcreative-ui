/**
 * Wiring for a popup's trigger.
 *
 * Dropdown and Popover take the trigger as a snippet, so the real control is
 * whatever the consumer passed — a Button, a link, an avatar. Rather than wrap
 * it in another button (which would nest interactive elements and put the ARIA
 * state on the wrong node), these attach to the element that is already there.
 */
/** Milliseconds a hover popup stays up after the pointer leaves. */
export const HOVER_GRACE = 120;
export function popupTrigger(node, options) {
    let opts = options;
    let timer;
    const onClick = () => opts.toggle();
    const onShow = () => {
        clearTimeout(timer);
        opts.open();
    };
    const onHide = () => {
        timer = setTimeout(() => opts.close(), HOVER_GRACE);
    };
    const onKeydown = (event) => {
        if (!opts.arrowOpens || event.key !== 'ArrowDown')
            return;
        if (opts.isOpen?.())
            return;
        event.preventDefault();
        opts.open();
    };
    const bind = () => {
        if (opts.on === 'hover') {
            node.addEventListener('pointerenter', onShow);
            node.addEventListener('pointerleave', onHide);
            node.addEventListener('focusin', onShow);
            node.addEventListener('focusout', onHide);
        }
        else {
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
        update(next) {
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
export function describeTrigger(wrapper, kind, open) {
    const control = wrapper?.querySelector('button, a, [role="button"]');
    if (!control)
        return;
    control.setAttribute('aria-haspopup', kind);
    control.setAttribute('aria-expanded', String(open));
}
/** The menu items a roving-focus menu should walk, in DOM order. */
export function menuItems(menu) {
    return menu ? [...menu.querySelectorAll('[role="menuitem"]:not([disabled])')] : [];
}
