import { type TagRejection } from '../../core/tags.js';
import { type Tone } from '../../core/tones.js';
interface Props {
    /** Bindable list of tags, in the order they were added. */
    tags?: string[];
    placeholder?: string;
    /** Cap on how many may be held. `0` means no limit. */
    max?: number;
    /** Shortest a tag may be, after trimming. */
    minLength?: number;
    /** Keys that commit the tag under the caret, besides Enter. */
    separators?: string[];
    /** Refuse a tag that differs from an existing one only in case. */
    caseInsensitive?: boolean;
    /** Commit whatever is half-typed when the field loses focus. */
    commitOnBlur?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    tone?: Tone;
    /** `name` for a plain form submit — one hidden field, comma-joined. */
    name?: string;
    onadd?: (tag: string) => void;
    onremove?: (tag: string) => void;
    onreject?: (reason: TagRejection, raw: string) => void;
    class?: string;
}
declare const TagsInput: import("svelte").Component<Props, {}, "tags">;
type TagsInput = ReturnType<typeof TagsInput>;
export default TagsInput;
