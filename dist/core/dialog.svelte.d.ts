/**
 * Keeps a bound `open` prop and a native `<dialog>` in step.
 *
 * `showModal()` throws if the dialog is already open and `close()` fires an
 * event of its own, so both directions need the guard below. Every overlay
 * built on `<dialog>` — Modal, Drawer, CommandPalette — calls this from an
 * effect rather than repeating the two `if`s.
 */
export declare function syncDialog(dialog: HTMLDialogElement | null, open: boolean): void;
/**
 * True when a click landed on the backdrop rather than inside the panel.
 * The backdrop is not a separate element — it is the dialog's own box.
 */
export declare function isBackdropClick(event: MouseEvent, dialog: HTMLDialogElement | null): boolean;
