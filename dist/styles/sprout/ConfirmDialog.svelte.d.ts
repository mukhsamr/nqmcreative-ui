import type { Snippet } from 'svelte';
import { type Tone } from '../../core/tones.js';
interface Props {
    open?: boolean;
    title: string;
    description?: string;
    /** Drives the confirm button and the glyph. `danger` for destructive acts. */
    tone?: Tone;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Spins the confirm button and blocks dismissal while the action runs. */
    loading?: boolean;
    /** Awaited — the dialog stays open and busy until it settles. */
    onconfirm?: () => void | Promise<void>;
    oncancel?: () => void;
    icon?: Snippet;
    /** Extra content between the description and the buttons. */
    children?: Snippet;
}
declare const ConfirmDialog: import("svelte").Component<Props, {}, "open" | "loading">;
type ConfirmDialog = ReturnType<typeof ConfirmDialog>;
export default ConfirmDialog;
