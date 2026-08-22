/**
 * Keeps a bound `open` prop and a native `<dialog>` in step.
 *
 * `showModal()` throws if the dialog is already open and `close()` fires an
 * event of its own, so both directions need the guard below. Every overlay
 * built on `<dialog>` — Modal, Drawer, CommandPalette — calls this from an
 * effect rather than repeating the two `if`s.
 */
export function syncDialog(dialog, open) {
    if (!dialog)
        return;
    if (open && !dialog.open)
        dialog.showModal();
    else if (!open && dialog.open)
        dialog.close();
}
/**
 * True when a click landed on the backdrop rather than inside the panel.
 * The backdrop is not a separate element — it is the dialog's own box.
 */
export function isBackdropClick(event, dialog) {
    return !!dialog && event.target === dialog;
}
