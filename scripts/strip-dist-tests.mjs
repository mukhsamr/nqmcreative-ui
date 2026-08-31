/**
 * `svelte-package` copies everything under `src/lib` into `dist`, tests
 * included. `package.json#files` keeps them out of an npm tarball, but this
 * package is consumed through `bun link`, which copies the whole folder — so
 * remove them from `dist` outright.
 *
 * `styles/styles.js` goes with them. It imports every style at once so the
 * parity suite can compare them, which is exactly what a consumer must never
 * do — shipping it would leave a path in the package that pulls in all of them.
 * Note that `files` does *not* filter it the way it filters `*.test.*`, so this
 * script is the only thing keeping it out of a release.
 */
import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname — the latter yields "/D:/…" on Windows.
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/** Backoff between attempts, in ms. Five tries, just over a second in total. */
const RETRIES = [50, 100, 200, 400];

/**
 * Deletes one file, retrying while Windows says it is busy.
 *
 * `svelte-package` wrote these files a moment ago, and on Windows something is
 * often still holding a handle when we get here — an antivirus scanning what
 * was just created, an indexer, or the test run that ran immediately before in
 * `prepublishOnly`. The handle is released within milliseconds; the unlink only
 * has to wait for it.
 *
 * Nothing here swallows the error. A file that stays locked has to stop the
 * build, because the alternative is a half-stripped `dist` that still looks
 * publishable — and the one file most likely to survive that is `styles.js`.
 */
async function remove(path) {
	for (let attempt = 0; ; attempt++) {
		try {
			await rm(path, { force: true });
			return;
		} catch (error) {
			const locked = error.code === 'EBUSY' || error.code === 'EPERM';
			if (!locked || attempt >= RETRIES.length) throw error;
			await new Promise((resolve) => setTimeout(resolve, RETRIES[attempt]));
		}
	}
}

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
			await remove(path);
			removed++;
		}
	}
	return removed;
}

try {
	let removed = await strip(DIST);

	for (const name of ['styles.js', 'styles.d.ts']) {
		const path = join(DIST, 'styles', name);
		if (!existsSync(path)) continue; // not built yet
		await remove(path);
		removed++;
	}

	console.log(`stripped ${removed} test file(s) from dist`);
} catch (error) {
	console.error(`could not strip ${error.path ?? 'a file'} from dist: ${error.code ?? error}`);
	console.error('something is holding it open — close editors and test watchers, then re-run.');
	process.exit(1);
}
