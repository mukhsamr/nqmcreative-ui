/**
 * Regenerates the `exports` map in package.json from what is actually in
 * `src/lib`, so every style and every component is importable on its own:
 *
 *   import { Button } from '@nqmcreative/ui/matte';
 *   import Button from '@nqmcreative/ui/paper/button';
 *   import { focusTrap } from '@nqmcreative/ui/core';
 *
 * There is deliberately no `.` entry. A component belongs to a style, and a
 * style has to be chosen on purpose — a root export would let people pick one
 * by accident. See `src/lib/index.ts`.
 *
 * Run with `--check` to fail instead of writing — used by `bun run lint` so a
 * new component cannot be added without its subpath.
 */
import { access, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, STYLES, toSubpath } from './catalogue.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');

const exists = async (path) => {
	try {
		await access(new URL(path, `file://${root}`));
		return true;
	} catch {
		return false;
	}
};

/** Core modules that are useful on their own. */
const coreModules = [
	['', 'index'],
	['/tones', 'tones'],
	['/date', 'date'],
	['/toast', 'toast.svelte'],
	['/theme', 'theme.svelte'],
	['/table', 'table'],
	['/files', 'files'],
	['/list', 'list.svelte'],
	['/actions/anchor', 'actions/anchor'],
	['/actions/dismissable', 'actions/dismissable']
];

const exportsMap = {};

for (const [suffix, file] of coreModules) {
	exportsMap[`./core${suffix}`] = {
		types: `./dist/core/${file}.d.ts`,
		svelte: `./dist/core/${file}.js`,
		default: `./dist/core/${file}.js`
	};
}

for (const style of STYLES) {
	const dir = `dist/styles/${style.name}`;

	exportsMap[`./${style.name}`] = {
		types: `./${dir}/index.d.ts`,
		svelte: `./${dir}/index.js`
	};

	for (const { name } of COMPONENTS) {
		exportsMap[`./${style.name}/${toSubpath(name)}`] = {
			types: `./${dir}/${name}.svelte.d.ts`,
			svelte: `./${dir}/${name}.svelte`
		};
	}

	exportsMap[`./${style.name}/theme.css`] = `./${dir}/theme.css`;
	// Not every style ships webfonts — paper runs on the system stack.
	if (await exists(`src/lib/styles/${style.name}/fonts.css`))
		exportsMap[`./${style.name}/fonts.css`] = `./${dir}/fonts.css`;
}

const pkgPath = new URL('package.json', `file://${root}`);
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
const current = JSON.stringify(pkg.exports);
const next = JSON.stringify(exportsMap);

const summary = `${STYLES.length} styles × ${COMPONENTS.length} components`;

if (current === next) {
	console.log(`exports up to date (${summary})`);
	process.exit(0);
}

if (check) {
	console.error('package.json "exports" is stale — run `bun run exports`');
	process.exit(1);
}

pkg.exports = exportsMap;
await writeFile(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
console.log(`exports written (${summary})`);
