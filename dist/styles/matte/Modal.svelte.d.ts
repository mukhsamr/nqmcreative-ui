import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
export type ModalSize = 'sm' | 'md' | 'lg';
interface Props extends HTMLDialogAttributes {
    /** Bindable. Uses the native `<dialog>` top layer + backdrop. */
    open?: boolean;
    title?: string;
    description?: string;
    size?: ModalSize;
    /** Clicking the backdrop or pressing Escape closes the dialog. */
    dismissible?: boolean;
    /** Show the header's close button. Defaults to `dismissible` — turn it off
     *  when the footer already carries the way out. */
    showClose?: boolean;
    footer?: Snippet;
    onclose?: () => void;
    children: Snippet;
}
declare const Modal: import("svelte").Component<Props, {}, "open">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
