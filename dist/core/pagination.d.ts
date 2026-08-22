/**
 * The page numbers a pager should show. Collapses long runs to `…` while
 * always keeping the first page, the last page, and `siblings` either side of
 * the current one — so the control never changes width as you walk through it.
 */
export declare function pageRange(page: number, total: number, siblings?: number): (number | '…')[];
