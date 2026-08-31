/**
 * Free-text tokens: what counts as a new tag, and why one was turned away.
 *
 * The rejection is returned rather than thrown or swallowed, so the component
 * can say *why* nothing happened — a silent no-op on a duplicate reads like a
 * broken field.
 */
/**
 * Sorts one commit into the next list, or the reason there isn't one.
 *
 * Order matters, the way it does in `sortFiles`: a tag is judged on being
 * present, then long enough, then unique, then whether there is room — so the
 * message a user sees is the first rule they actually broke.
 */
export function addTag(tags, raw, rules = {}) {
    const { trim = true, caseInsensitive = true, max = 0, minLength = 1 } = rules;
    const value = trim ? raw.trim().replace(/\s+/g, ' ') : raw;
    if (!value)
        return { tags, rejected: 'empty' };
    if (value.length < minLength)
        return { tags, rejected: 'short' };
    const fold = (text) => (caseInsensitive ? text.toLowerCase() : text);
    if (tags.some((tag) => fold(tag) === fold(value)))
        return { tags, rejected: 'duplicate' };
    if (max && tags.length >= max)
        return { tags, rejected: 'full' };
    return { tags: [...tags, value] };
}
/**
 * Splits pasted text so one paste can commit several tags.
 *
 * Scanned character by character rather than with a RegExp: the separators are
 * the app's to choose, and building a character class out of them means
 * escaping every one that happens to be a metacharacter.
 */
export function splitTags(text, separators = [',']) {
    const marks = new Set([...separators, '\n', '\r', '\t']);
    const found = [];
    let current = '';
    for (const char of text) {
        if (marks.has(char)) {
            found.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    found.push(current);
    return found.map((tag) => tag.trim()).filter(Boolean);
}
