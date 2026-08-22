#!/usr/bin/env node
/**
 * @nqmcreative/ui CLI
 *
 *   nqm-ui init            wire the design system into this project
 *   nqm-ui add <name...>   print (or insert) the import for a component
 *   nqm-ui list [category] every component and its subpath
 *   nqm-ui info <name>     what one component pulls in
 *
 * Node built-ins only, so `bunx @nqmcreative/ui init` needs nothing installed.
 * Every write is idempotent: running init twice changes nothing the second
 * time.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));

/** Flags that take a value, so the value is not mistaken for a positional. */
const valueFlags = new Set(['--to', '--style']);
const args = [];
for (let i = 0; i < argv.length; i++) {
	if (argv[i].startsWith('--')) {
		if (valueFlags.has(argv[i])) i++;
		continue;
	}
	args.push(argv[i]);
}

const command = args[0];
const dryRun = flags.has('--dry-run');

/* ---------------------------------------------------------------- output -- */

const c = {
	dim: (s) => `\x1b[2m${s}\x1b[0m`,
	bold: (s) => `\x1b[1m${s}\x1b[0m`,
	green: (s) => `\x1b[32m${s}\x1b[0m`,
	yellow: (s) => `\x1b[33m${s}\x1b[0m`,
	red: (s) => `\x1b[31m${s}\x1b[0m`,
	cyan: (s) => `\x1b[36m${s}\x1b[0m`
};

const log = (msg = '') => console.log(msg);
const ok = (msg) => log(`${c.green('✓')} ${msg}`);
const skip = (msg) => log(`${c.dim('·')} ${c.dim(msg)}`);
const warn = (msg) => log(`${c.yellow('!')} ${msg}`);
const fail = (msg) => {
	console.error(`${c.red('✗')} ${msg}`);
	process.exit(1);
};

/* -------------------------------------------------------------- registry -- */

async function registry() {
	// Sits next to the CLI once packed, one level up in the repo.
	for (const path of [join(here, 'registry.json'), join(here, '..', 'registry.json')]) {
		if (existsSync(path)) return JSON.parse(await readFile(path, 'utf8'));
	}
	fail('registry.json not found — is the package installed correctly?');
}

/** Accepts `Button`, `button`, `date-picker` or any style's full subpath. */
function findComponent(list, query) {
	const needle = query.toLowerCase().replace(/^@nqmcreative\/ui\/[a-z-]+\//, '');
	return list.find((item) => item.name.toLowerCase() === needle || item.slug === needle);
}

/**
 * The style to work in. There is no default on purpose: a component belongs to
 * a style, and picking one by accident is the mistake this package exists to
 * prevent. Asking once beats shipping the wrong look.
 */
function pickStyle(styles) {
	const index = argv.indexOf('--style');
	const wanted = index !== -1 ? argv[index + 1] : null;

	if (!wanted) {
		log();
		log('  which style?');
		log();
		for (const style of styles) {
			log(`    ${c.cyan(style.name.padEnd(8))} ${c.dim(style.description)}`);
		}
		log();
		log(`  ${c.dim(`e.g. ${command} --style ${styles[0].name}`)}`);
		log();
		process.exit(1);
	}

	const style = styles.find((s) => s.name === wanted);
	if (!style) fail(`unknown style "${wanted}" — try ${styles.map((s) => s.name).join(' or ')}`);
	return style;
}

/* ------------------------------------------------------------ file edits -- */

async function readOr(path, fallback = '') {
	try {
		return await readFile(path, 'utf8');
	} catch {
		return fallback;
	}
}

async function write(path, content, label) {
	if (dryRun) {
		skip(`would write ${label ?? relative(cwd, path)}`);
		return;
	}
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content, 'utf8');
	ok(label ?? relative(cwd, path));
}

/* -------------------------------------------------------------- detection -- */

async function detectProject() {
	const pkgPath = join(cwd, 'package.json');
	if (!existsSync(pkgPath)) fail('no package.json here — run this inside your project');

	const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };

	const isKit = '@sveltejs/kit' in deps;
	const hasTailwind = '@tailwindcss/vite' in deps || 'tailwindcss' in deps;
	const hasUi = '@nqmcreative/ui' in deps;

	// Where the Tailwind entry CSS lives, or should.
	const candidates = isKit
		? ['src/app.css', 'src/routes/+layout.css', 'src/app.postcss']
		: ['src/app.css', 'src/style.css', 'src/main.css'];
	const css = candidates.find((path) => existsSync(join(cwd, path))) ?? candidates[0];

	return { pkg, deps, isKit, hasTailwind, hasUi, css: join(cwd, css), cssRel: css };
}

/** How many `../` from the CSS file up to node_modules. */
function sourcePath(cssRel) {
	const depth = cssRel.split(/[\\/]/).length - 1;
	return `${'../'.repeat(depth) || './'}node_modules/@nqmcreative/ui/dist`;
}

/* ------------------------------------------------------------------ init -- */

async function init() {
	const { styles } = await registry();
	const style = pickStyle(styles);
	const project = await detectProject();

	log();
	log(c.bold(`  @nqmcreative/ui — ${style.title}`));
	log(c.dim(`  ${project.isKit ? 'SvelteKit' : 'Svelte + Vite'} project detected`));
	log();

	if (!project.hasUi) {
		warn('the package is not installed yet — add it first:');
		log(c.cyan('    bun add @nqmcreative/ui'));
		log();
	}

	if (!project.hasTailwind) {
		warn('Tailwind CSS v4 is not installed:');
		log(c.cyan('    bun add -d tailwindcss @tailwindcss/vite'));
		log();
	}

	/* --- 1. the entry CSS --- */
	const source = sourcePath(project.cssRel);
	const lines = [
		`@import 'tailwindcss';`,
		`@import '@nqmcreative/ui/${style.name}/theme.css';`,
		...(style.fonts ? [`@import '@nqmcreative/ui/${style.name}/fonts.css';`] : []),
		``,
		`/* Tailwind v4 skips node_modules — point it at this style's folder so`,
		`   the class names used inside its components are generated. */`,
		`@source '${source}/styles/${style.name}';`
	];

	const css = await readOr(project.css);
	if (css.includes('@nqmcreative/ui/') && css.includes('theme.css')) {
		skip(`${project.cssRel} already imports the theme`);
	} else {
		const body = css.trim()
			? `${lines.join('\n')}\n\n${css.replace(/@import 'tailwindcss';\n?/, '').trim()}\n`
			: `${lines.join('\n')}\n`;
		await write(project.css, body, project.cssRel);
	}

	/* --- 2. app.html: font preconnect + no-flash theme --- */
	if (project.isKit) {
		const htmlPath = join(cwd, 'src/app.html');
		let html = await readOr(htmlPath);
		if (!html) {
			// Some `sv create` templates omit it and let SvelteKit fall back to a
			// built-in. Write the standard one so there is somewhere to put the
			// preconnect and the no-flash theme script.
			html = [
				'<!doctype html>',
				'<html lang="en">',
				'	<head>',
				'		<meta charset="utf-8" />',
				'		<meta name="viewport" content="width=device-width, initial-scale=1" />',
				'		%sveltekit.head%',
				'	</head>',
				'	<body data-sveltekit-preload-data="hover">',
				'		<div style="display: contents">%sveltekit.body%</div>',
				'	</body>',
				'</html>',
				''
			].join('\n');
			skip('src/app.html was missing — creating it');
		}
		{
			// Unindented — `%sveltekit.head%` already sits at its own indentation,
			// so the join below supplies it and the first line does not double up.
			const additions = [];
			if (style.fonts && !html.includes('fonts.gstatic.com')) {
				additions.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`);
			}
			if (!html.includes('nqm-theme')) {
				additions.push(
					`<script>`,
					`\tconst saved = localStorage.getItem('nqm-theme');`,
					`\tif (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);`,
					`</script>`
				);
			}
			if (additions.length === 0) {
				skip('src/app.html already wired');
			} else if (!html.includes('%sveltekit.head%')) {
				warn('src/app.html has no %sveltekit.head% — add these by hand:');
				log(additions.map((line) => `\t\t${line}`).join('\n'));
			} else {
				const indent = /([ \t]*)%sveltekit\.head%/.exec(html)?.[1] ?? '\t\t';
				html = html.replace(
					'%sveltekit.head%',
					`${additions.join(`\n${indent}`)}\n${indent}%sveltekit.head%`
				);
				await write(htmlPath, html, 'src/app.html');
			}
		}
	}

	/* --- 3. remind about the vite plugin, which we will not rewrite --- */
	const viteConfig =
		['vite.config.ts', 'vite.config.js'].map((f) => join(cwd, f)).find((f) => existsSync(f)) ??
		null;
	const viteSource = viteConfig ? await readOr(viteConfig) : '';
	if (!viteSource.includes('@tailwindcss/vite')) {
		log();
		warn(
			`add the Tailwind plugin to ${viteConfig ? relative(cwd, viteConfig) : 'your vite config'} — before sveltekit():`
		);
		log(c.cyan(`    import tailwindcss from '@tailwindcss/vite';`));
		log(c.cyan(`    plugins: [tailwindcss(), sveltekit()]`));
	} else {
		skip('vite config already has the Tailwind plugin');
	}

	/* --- 4. import the CSS once --- */
	if (project.isKit) {
		const layoutPath = join(cwd, 'src/routes/+layout.svelte');
		let layout = await readOr(layoutPath);
		const line = `import '../app.css';`;

		if (layout.includes('app.css')) {
			skip('src/routes/+layout.svelte already imports the CSS');
		} else if (!layout.trim()) {
			await write(
				layoutPath,
				`<script lang="ts">
	${line}

	let { children } = $props();
</script>

{@render children()}
`,
				'src/routes/+layout.svelte'
			);
		} else if (/<script[^>]*>/.test(layout)) {
			layout = layout.replace(/(<script[^>]*>\n)/, `$1\t${line}\n`);
			await write(layoutPath, layout, 'src/routes/+layout.svelte');
		} else {
			log();
			warn('import the CSS once, at the top of src/routes/+layout.svelte:');
			log(c.cyan(`    ${line}`));
		}
	}

	log();
	log(`  Next: ${c.cyan(`bunx @nqmcreative/ui add button --style ${style.name}`)}`);
	log();
}

/* ------------------------------------------------------------------- add -- */

async function add() {
	const { components, styles } = await registry();
	const style = pickStyle(styles);
	const names = args.slice(1);
	if (names.length === 0) fail('which component? e.g. `nqm-ui add button dialog`');

	const found = [];
	for (const name of names) {
		const item = findComponent(components, name);
		if (!item) {
			const close = components
				.filter((c) => c.name.toLowerCase().startsWith(name.slice(0, 3).toLowerCase()))
				.slice(0, 3)
				.map((c) => c.slug);
			fail(
				`unknown component "${name}"${close.length ? ` — did you mean ${close.join(', ')}?` : ''}`
			);
		}
		found.push(item);
	}

	const imports = found.map((item) => `import ${item.name} from '${item.subpaths[style.name]}';`);

	// `--to <file>` inserts the imports into an existing Svelte file.
	const toIndex = argv.indexOf('--to');
	const target = toIndex !== -1 ? argv[toIndex + 1] : null;

	if (target) {
		const path = resolve(cwd, target);
		if (!existsSync(path)) fail(`${target} not found`);
		let source = await readFile(path, 'utf8');

		const missing = imports.filter((line) => !source.includes(line));
		if (missing.length === 0) {
			skip(`${target} already imports ${found.map((f) => f.name).join(', ')}`);
			return;
		}

		if (/<script[^>]*>/.test(source)) {
			source = source.replace(/(<script[^>]*>\n)/, `$1\t${missing.join('\n\t')}\n`);
		} else {
			source = `<script lang="ts">\n\t${missing.join('\n\t')}\n</script>\n\n${source}`;
		}
		await write(path, source, target);
	} else {
		log();
		log(imports.join('\n'));
		log();
	}

	const pulled = [...new Set(found.flatMap((item) => item.uses))].filter(
		(name) => !found.some((f) => f.name === name)
	);
	if (pulled.length) {
		log(c.dim(`  renders ${pulled.join(', ')} internally — nothing to install`));
		log();
	}
}

/* ------------------------------------------------------------------ list -- */

async function list() {
	const { components, count, styles } = await registry();
	const filter = args[1]?.toLowerCase();

	const groups = {};
	for (const item of components) {
		if (filter && !item.category.toLowerCase().includes(filter)) continue;
		(groups[item.category] ??= []).push(item);
	}

	const shown = Object.values(groups).flat().length;
	if (shown === 0) fail(`no components in category "${filter}"`);

	log();
	for (const [category, items] of Object.entries(groups)) {
		log(`  ${c.bold(category)}`);
		for (const item of items) {
			log(`    ${item.slug.padEnd(20)} ${c.dim(item.description)}`);
		}
		log();
	}
	log(
		c.dim(
			`  ${shown} of ${count} components, in every style: ${styles.map((s) => s.name).join(', ')}`
		)
	);
	log();
}

/* ------------------------------------------------------------------ info -- */

async function info() {
	const { components } = await registry();
	const item = findComponent(components, args[1] ?? '');
	if (!item) fail(`unknown component "${args[1] ?? ''}" — try \`nqm-ui list\``);

	log();
	log(`  ${c.bold(item.name)}  ${c.dim(item.category)}`);
	if (item.description) log(`  ${item.description}`);
	log();
	for (const [style, subpath] of Object.entries(item.subpaths)) {
		log(`  ${c.dim(style.padEnd(8))} ${c.cyan(`import ${item.name} from '${subpath}';`)}`);
	}
	log();
	if (item.uses.length) log(`  renders    ${item.uses.join(', ')}`);
	if (item.modules.length) log(`  core       ${item.modules.join(', ')}`);
	log();
}

/* ------------------------------------------------------------------ help -- */

function help() {
	log(`
  ${c.bold('@nqmcreative/ui')}

    ${c.cyan('init --style <s>')}      wire one style into this project
    ${c.cyan('add <name...>')}         print the import for a component
      ${c.dim('--style <s>')}         which style to import from (required)
      ${c.dim('--to <file>')}         …and insert it into that file instead
    ${c.cyan('list [category]')}       every component in the catalogue
    ${c.cyan('info <name>')}           what one component pulls in, in every style

    ${c.dim('--dry-run')}             show the writes without making them

  ${c.dim('Every style implements every component. Run init once per project.')}
`);
}

/* ------------------------------------------------------------------ main -- */

const commands = { init, add, list, info };
if (!command || flags.has('--help') || command === 'help') {
	help();
} else if (commands[command]) {
	await commands[command]();
} else {
	fail(`unknown command "${command}" — try \`nqm-ui --help\``);
}
