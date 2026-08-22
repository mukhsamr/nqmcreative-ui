/**
 * File validation for the drop zone: which files a set of rules lets through,
 * why the rest were turned away, and how to print a byte count.
 */
/** `image/*`, `.pdf` and `application/pdf` all mean what you would expect. */
export function matchesAccept(file, accept) {
    if (!accept)
        return true;
    return accept.split(',').some((raw) => {
        const rule = raw.trim().toLowerCase();
        if (!rule)
            return true;
        if (rule.startsWith('.'))
            return file.name.toLowerCase().endsWith(rule);
        if (rule.endsWith('/*'))
            return file.type.startsWith(rule.slice(0, -1));
        return file.type.toLowerCase() === rule;
    });
}
/**
 * Sorts one drop into keepers and rejects. Order matters: a file is judged on
 * type first, then size, then whether there is room left — so the reason a
 * user sees is the first rule it actually broke.
 */
export function sortFiles(incoming, rules = {}) {
    const accepted = [];
    const rejected = [];
    if (!incoming)
        return { accepted, rejected };
    const { accept, maxSize = 0, maxFiles = 0, multiple = true, held = 0 } = rules;
    let room = maxFiles ? maxFiles - (multiple ? held : 0) : Infinity;
    for (const file of Array.from(incoming)) {
        if (!matchesAccept(file, accept))
            rejected.push({ file, reason: 'type' });
        else if (maxSize && file.size > maxSize)
            rejected.push({ file, reason: 'size' });
        else if (room <= 0)
            rejected.push({ file, reason: 'count' });
        else {
            accepted.push(file);
            room--;
        }
        if (!multiple && accepted.length === 1)
            break;
    }
    return { accepted, rejected };
}
/**
 * `900 B`, `2 MB`, `1.5 GB`. Units come from the locale so the number and its
 * suffix can be translated together.
 */
export function formatSize(bytes, units) {
    if (bytes < 1024)
        return `${bytes} ${units[0]}`;
    let value = bytes / 1024;
    let i = 1;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(Number.isInteger(value) || value >= 10 ? 0 : 1)} ${units[i]}`;
}
