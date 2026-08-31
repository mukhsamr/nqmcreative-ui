import { type RejectedFile } from '../../core/files.js';
import { type Tone } from '../../core/tones.js';
import type { InputSize } from './Input.svelte';
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
    size?: InputSize;
    tone?: Tone;
    invalid?: boolean;
    /** Text on the button. Defaults to `Choose file`. */
    label?: string;
    /** Shown while nothing is chosen. Defaults to `No file chosen`. */
    placeholder?: string;
    /** Show the list of held files below the row. */
    showList?: boolean;
    /** The `name` the hidden input posts under, for a plain form submit. */
    name?: string;
    onaccept?: (files: File[]) => void;
    onreject?: (rejected: RejectedFile[]) => void;
    class?: string;
}
declare const FileInput: import("svelte").Component<Props, {}, "files">;
type FileInput = ReturnType<typeof FileInput>;
export default FileInput;
