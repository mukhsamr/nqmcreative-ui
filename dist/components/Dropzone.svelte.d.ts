import type { Snippet } from 'svelte';
import { type Tone } from '../tones.js';
export interface RejectedFile {
    file: File;
    reason: 'type' | 'size' | 'count';
}
interface Props {
    /** Bindable list of accepted files. */
    files?: File[];
    /** Same syntax as the input's `accept` — `'image/*,.pdf'`. */
    accept?: string;
    multiple?: boolean;
    /** Per-file ceiling in bytes. `0` means no limit. */
    maxSize?: number;
    /** Cap on how many files may be held at once. `0` means no limit. */
    maxFiles?: number;
    disabled?: boolean;
    tone?: Tone;
    /** Headline inside the zone. Defaults to the locale's `dropFiles`. */
    label?: string;
    hint?: string;
    /** Hide the built-in file list to render your own. */
    showList?: boolean;
    onaccept?: (files: File[]) => void;
    onreject?: (rejected: RejectedFile[]) => void;
    /** Replaces the glyph above the label. */
    icon?: Snippet;
    class?: string;
}
declare const Dropzone: import("svelte").Component<Props, {}, "files">;
type Dropzone = ReturnType<typeof Dropzone>;
export default Dropzone;
