export interface CommandItem {
    id: string;
    label: string;
    /** Second line under the label. */
    description?: string;
    /** Items sharing a group are rendered under one heading. */
    group?: string;
    /** Right-aligned hint, e.g. `'⌘K'`. */
    shortcut?: string;
    /** Extra words to match on that aren't in the label. */
    keywords?: string;
    disabled?: boolean;
    onselect?: () => void;
}
import { type Tone } from '../tones.js';
interface Props {
    open?: boolean;
    items: CommandItem[];
    placeholder?: string;
    emptyText?: string;
    tone?: Tone;
    /**
     * Key that opens the palette with Cmd/Ctrl held. Default `'k'`.
     * Pass `null` to wire your own trigger only.
     */
    hotkey?: string | null;
    onselect?: (item: CommandItem) => void;
    class?: string;
}
declare const CommandPalette: import("svelte").Component<Props, {}, "open">;
type CommandPalette = ReturnType<typeof CommandPalette>;
export default CommandPalette;
