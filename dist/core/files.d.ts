/**
 * File validation for the drop zone: which files a set of rules lets through,
 * why the rest were turned away, and how to print a byte count.
 */
export interface RejectedFile {
    file: File;
    reason: 'type' | 'size' | 'count';
}
export interface FileRules {
    /** Same syntax as the input's `accept` — `'image/*,.pdf'`. */
    accept?: string;
    /** Per-file ceiling in bytes. `0` means no limit. */
    maxSize?: number;
    /** Cap on how many files may be held at once. `0` means no limit. */
    maxFiles?: number;
    multiple?: boolean;
    /** How many are already held, counted against `maxFiles`. */
    held?: number;
}
/** `image/*`, `.pdf` and `application/pdf` all mean what you would expect. */
export declare function matchesAccept(file: File, accept?: string): boolean;
/**
 * Sorts one drop into keepers and rejects. Order matters: a file is judged on
 * type first, then size, then whether there is room left — so the reason a
 * user sees is the first rule it actually broke.
 */
export declare function sortFiles(incoming: FileList | File[] | null, rules?: FileRules): {
    accepted: File[];
    rejected: RejectedFile[];
};
/**
 * `900 B`, `2 MB`, `1.5 GB`. Pass `units` to relabel the suffixes.
 */
export declare function formatSize(bytes: number, units?: readonly string[]): string;
