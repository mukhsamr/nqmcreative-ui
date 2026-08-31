import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { Tone } from '../../core/tones.js';
import { type InputSize } from './Input.svelte';
interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'type'> {
    value?: string;
    size?: InputSize;
    tone?: Tone;
    invalid?: boolean;
    /**
     * Milliseconds to wait after the last keystroke before `onsearch` fires.
     * `0` fires on every one.
     */
    debounce?: number;
    /** The debounced value. The bound `value` still updates immediately. */
    onsearch?: (value: string) => void;
    onclear?: () => void;
    /** Replaces the magnifier. */
    icon?: Snippet;
    class?: string;
}
declare const SearchInput: import("svelte").Component<Props, {}, "value">;
type SearchInput = ReturnType<typeof SearchInput>;
export default SearchInput;
