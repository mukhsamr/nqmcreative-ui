/**
 * The page numbers a pager should show. Collapses long runs to `…` while
 * always keeping the first page, the last page, and `siblings` either side of
 * the current one — so the control never changes width as you walk through it.
 */
export function pageRange(page, total, siblings = 1) {
    if (total <= 5 + siblings * 2) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const start = Math.max(2, page - siblings);
    const end = Math.min(total - 1, page + siblings);
    const out = [1];
    if (start > 2)
        out.push('…');
    for (let i = start; i <= end; i++)
        out.push(i);
    if (end < total - 1)
        out.push('…');
    out.push(total);
    return out;
}
