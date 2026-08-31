/**
 * Free-text tokens: what counts as a new tag, and why one was turned away.
 *
 * The rejection is returned rather than thrown or swallowed, so the component
 * can say *why* nothing happened — a silent no-op on a duplicate reads like a
 * broken field.
 */
export type TagRejection = 'empty' | 'short' | 'duplicate' | 'full';
export interface TagRules {
    /** Trim the ends and collapse inner runs of whitespace. Default `true`. */
    trim?: boolean;
    /** Ignore case when refusing duplicates. Default `true`. */
    caseInsensitive?: boolean;
    /** Cap on how many tags may be held. `0` means no limit. */
    max?: number;
    /** Shortest a tag may be, after trimming. */
    minLength?: number;
}
/**
 * Sorts one commit into the next list, or the reason there isn't one.
 *
 * Order matters, the way it does in `sortFiles`: a tag is judged on being
 * present, then long enough, then unique, then whether there is room — so the
 * message a user sees is the first rule they actually broke.
 */
export declare function addTag(tags: string[], raw: string, rules?: TagRules): {
    tags: string[];
    rejected?: TagRejection;
};
/**
 * Splits pasted text so one paste can commit several tags.
 *
 * Scanned character by character rather than with a RegExp: the separators are
 * the app's to choose, and building a character class out of them means
 * escaping every one that happens to be a metacharacter.
 */
export declare function splitTags(text: string, separators?: readonly string[]): string[];
