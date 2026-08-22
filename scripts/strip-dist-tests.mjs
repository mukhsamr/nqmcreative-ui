/**
 * `svelte-package` copies everything under `src/lib` into `dist`, tests
 * included. `package.json#files` keeps them out of an npm tarball, but this
 * package is consumed through `bun link`, which copies the whole folder — so
 * remove them from `dist` outright.
 *
 * `styles/styles.js` goes with them. It imports every style at once so the
 * parity suite can compare them, which is exactly what a consumer must never
 * do — shipping it would leave a path in the package that pulls in all of them.
 */
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname — the latter yields "/D:/…" on Windows.
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

async function strip(dir) {
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return 0;
	}

	let removed = 0;
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) removed += await strip(path);
		else if (/\.(test|spec)\.(js|ts|d\.ts)$/.test(entry.name)) {
			await rm(path);
			removed++;
		}
	}
	return removed;
}

let removed = await strip(DIST);

for (const name of ['styles.js', 'styles.d.ts']) {
	try {
		await rm(join(DIST, 'styles', name));
		removed++;
	} catch {
		/* not built yet */
	}
}

console.log(`stripped ${removed} test file(s) from dist`);
