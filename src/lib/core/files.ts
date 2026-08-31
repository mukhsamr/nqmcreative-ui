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
export function matchesAccept(file: File, accept?: string): boolean {
	if (!accept) return true;
	return accept.split(',').some((raw) => {
		const rule = raw.trim().toLowerCase();
		if (!rule) return true;
		if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
		if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
		return file.type.toLowerCase() === rule;
	});
}

/**
 * Sorts one drop into keepers and rejects. Order matters: a file is judged on
 * type first, then size, then whether there is room left — so the reason a
 * user sees is the first rule it actually broke.
 */
export function sortFiles(
	incoming: FileList | File[] | null,
	rules: FileRules = {}
): { accepted: File[]; rejected: RejectedFile[] } {
	const accepted: File[] = [];
	const rejected: RejectedFile[] = [];
	if (!incoming) return { accepted, rejected };

	const { accept, maxSize = 0, maxFiles = 0, multiple = true, held = 0 } = rules;
	let room = maxFiles ? maxFiles - (multiple ? held : 0) : Infinity;

	for (const file of Array.from(incoming)) {
		if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type' });
		else if (maxSize && file.size > maxSize) rejected.push({ file, reason: 'size' });
		else if (room <= 0) rejected.push({ file, reason: 'count' });
		else {
			accepted.push(file);
			room--;
		}
		if (!multiple && accepted.length === 1) break;
	}

	return { accepted, rejected };
}

/**
 * `900 B`, `2 MB`, `1.5 GB`. Pass `units` to relabel the suffixes.
 */
export function formatSize(
	bytes: number,
	units: readonly string[] = ['B', 'KB', 'MB', 'GB']
): string {
	if (bytes < 1024) return `${bytes} ${units[0]}`;
	let value = bytes / 1024;
	let i = 1;
	while (value >= 1024 && i < units.length - 1) {
		value /= 1024;
		i++;
	}
	return `${value.toFixed(Number.isInteger(value) || value >= 10 ? 0 : 1)} ${units[i]}`;
}
