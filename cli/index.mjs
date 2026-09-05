#!/usr/bin/env node
/**
 * @nqmcreative/ui CLI
 *
 *   nqm-ui init            wire the design system into this project
 *   nqm-ui update          rewrite that wiring after upgrading the package
 *   nqm-ui add <name...>   print (or insert) the import for a component
 *   nqm-ui list [category] every component and its subpath
 *   nqm-ui info <name>     what one component pulls in
 *
 * Node built-ins only, so `bunx @nqmcreative/ui init` needs nothing installed.
 * Every write is idempotent: the lines this CLI owns are rewritten from
 * scratch on every run, so running it twice changes nothing the second time —
 * and running it after an upgrade picks up whatever those lines became.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
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
 *
 * `--style` answers it up front. Without it a terminal gets a numbered prompt;
 * a pipe or a CI job gets the list and a non-zero exit, because there is
 * nobody there to answer.
 */
async function pickStyle(styles) {
	const index = argv.indexOf('--style');
	const wanted = index !== -1 ? argv[index + 1] : null;

	if (wanted) {
		const named = styles.find((s) => s.name === wanted);
		if (!named) fail(`unknown style "${wanted}" — try ${styles.map((s) => s.name).join(' or ')}`);
		return named;
	}

	log();
	log('  which style?');
	log();
	styles.forEach((style, i) => {
		log(`    ${c.cyan(`${i + 1})`)} ${c.bold(style.name.padEnd(8))} ${c.dim(style.description)}`);
	});
	log();

	if (!process.stdin.isTTY) {
		log(`  ${c.dim(`not a terminal — pass it: ${command} --style ${styles[0].name}`)}`);
		log();
		process.exit(1);
	}

	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		for (let attempt = 0; attempt < 3; attempt++) {
			const answer = (await rl.question(`  1-${styles.length}, or a name [1]: `)).trim();
			if (!answer) return styles[0];

			const number = Number(answer);
			if (Number.isInteger(number) && number >= 1 && number <= styles.length) {
				return styles[number - 1];
			}

			const named = styles.find((s) => s.name === answer.toLowerCase());
			if (named) return named;

			warn(`no style called "${answer}"`);
		}
	} finally {
		rl.close();
	}

	fail(`try ${command} --style ${styles[0].name}`);
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

/**
 * Which kind of project this is.
 *
 * The library itself is plain Svelte 5 — no `$app/*`, no `$env/*`, no
 * `@sveltejs/kit` anywhere in it — so a framework only decides where four
 * things live:
 *
 *   kit      src/app.css          src/app.html            src/routes/+layout.svelte
 *   vite     src/app.css          index.html              src/main.ts
 *   laravel  resources/css/…      resources/views/…       the @vite directive
 */
function detectFramework(deps) {
	if ('@sveltejs/kit' in deps) return 'kit';
	if (existsSync(join(cwd, 'artisan'))) return 'laravel';
	return 'vite';
}

const FRAMEWORK_LABEL = {
	kit: 'SvelteKit',
	laravel: 'Laravel + Svelte',
	vite: 'Svelte + Vite'
};

/** The first candidate that exists, or the first one as the place to create. */
function pickPath(candidates) {
	return candidates.find((path) => existsSync(join(cwd, path))) ?? candidates[0];
}

/** The one that exists, or null — for files we patch but never invent. */
function findPath(candidates) {
	return candidates.find((path) => existsSync(join(cwd, path))) ?? null;
}

async function detectProject() {
	const pkgPath = join(cwd, 'package.json');
	if (!existsSync(pkgPath)) fail('no package.json here — run this inside your project');

	const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };

	const framework = detectFramework(deps);
	const isKit = framework === 'kit';
	const hasTailwind = '@tailwindcss/vite' in deps || 'tailwindcss' in deps;
	const hasUi = '@nqmcreative/ui' in deps;
	// Kit brings its own; everywhere else the components are .svelte files in
	// node_modules and something has to compile them.
	const hasCompiler = isKit || '@sveltejs/vite-plugin-svelte' in deps;

	// Where the Tailwind entry CSS lives, or should.
	const css = pickPath(
		{
			kit: ['src/app.css', 'src/routes/+layout.css', 'src/app.postcss'],
			laravel: ['resources/css/app.css'],
			vite: ['src/app.css', 'src/style.css', 'src/main.css']
		}[framework]
	);

	// The document head, for the font preconnect and the no-flash theme script.
	// Kit gets one written if it is missing; the other two are only patched,
	// because guessing at someone's Blade layout would do more harm than a
	// printed reminder.
	const head = {
		kit: 'src/app.html',
		laravel: findPath([
			'resources/views/app.blade.php',
			'resources/views/layouts/app.blade.php',
			'resources/views/components/layouts/app.blade.php',
			'resources/views/welcome.blade.php'
		]),
		vite: findPath(['index.html'])
	}[framework];

	// Where the entry CSS gets imported. Laravel has nowhere: the `@vite`
	// directive in the Blade layout links it directly.
	const entry = {
		kit: 'src/routes/+layout.svelte',
		laravel: null,
		vite: findPath(['src/main.ts', 'src/main.js'])
	}[framework];

	return {
		pkg,
		deps,
		framework,
		isKit,
		hasTailwind,
		hasUi,
		hasCompiler,
		css: join(cwd, css),
		cssRel: css,
		head,
		entry
	};
}

/* ------------------------------------------------------------------ head -- */

/** Escapes a literal for use inside a RegExp — the markers contain `%` and `/`. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The two things that have to run before first paint, in document order. */
function headAdditions(style, html) {
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
	return additions;
}

/**
 * Puts them in the document head, wherever that is for this framework.
 *
 * Kit renders into a `%sveltekit.head%` placeholder; a Vite index.html and a
 * Blade layout both have a real `</head>` to sit above. When there is no file
 * to patch — or no marker in it — the lines are printed instead of guessed at.
 */
async function wireHead(project, style) {
	const { framework, head } = project;

	const printByHand = (additions, reason) => {
		log();
		warn(reason);
		log(additions.map((line) => c.cyan(`    ${line}`)).join('\n'));
	};

	if (!head) {
		printByHand(
			headAdditions(style, ''),
			framework === 'laravel'
				? 'no Blade layout found — put these inside <head> in yours:'
				: 'no index.html found — put these inside its <head>:'
		);
		return;
	}

	const htmlPath = join(cwd, head);
	let html = await readOr(htmlPath);

	if (!html && framework === 'kit') {
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

	const additions = headAdditions(style, html);
	if (additions.length === 0) {
		skip(`${head} already wired`);
		return;
	}

	const marker = framework === 'kit' ? '%sveltekit.head%' : '</head>';
	if (!html.includes(marker)) {
		printByHand(additions, `${head} has no ${marker} — add these by hand, inside <head>:`);
		return;
	}

	// Matched with its own indentation so the block lands at the right depth,
	// and replaced through a function so a `$` in the lines stays literal.
	html = html.replace(new RegExp(`([ \\t]*)${escapeRe(marker)}`), (_match, indent) => {
		// The placeholder is itself a child of <head>; a closing tag is not, so
		// its children sit one level deeper — in whichever unit the file uses.
		const unit = indent.startsWith('\t') ? '\t' : '    ';
		const inner = framework === 'kit' ? indent : `${indent}${unit}`;
		const body = additions.map((line) => line.replace(/^\t/, unit));
		return `${inner}${body.join(`\n${inner}`)}\n${indent}${marker}`;
	});
	await write(htmlPath, html, head);
}

/** How many `../` from the CSS file up to node_modules. */
function sourcePath(cssRel) {
	const depth = cssRel.split(/[\\/]/).length - 1;
	return `${'../'.repeat(depth) || './'}node_modules/@nqmcreative/ui/dist`;
}

/* ------------------------------------------------------------------ init -- */

async function init() {
	const { styles } = await registry();
	const style = await pickStyle(styles);
	const project = await detectProject();

	log();
	log(c.bold(`  @nqmcreative/ui — ${style.title}`));
	log(c.dim(`  ${FRAMEWORK_LABEL[project.framework]} project detected`));
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

	if (!project.hasCompiler) {
		// The package ships .svelte files, so the app compiles them itself.
		warn('nothing here compiles Svelte components:');
		log(c.cyan('    bun add -d svelte @sveltejs/vite-plugin-svelte'));
		log();
	}

	/* --- 1. the entry CSS --- */
	const source = sourcePath(project.cssRel);
	const lines = [
		`@import 'tailwindcss';`,
		`@import '@nqmcreative/ui/${style.name}/theme.css';`,
		...(style.fonts ? [`@import '@nqmcreative/ui/${style.name}/fonts.css';`] : []),
		``,
		`/* Tailwind v4 skips node_modules — point it at this style's folder and`,
		`   the shared core, so the class names used inside the components (tone`,
		`   colours and the like live in core) are generated. */`,
		`@source '${source}/styles/${style.name}';`,
		`@source '${source}/core';`
	];

	const css = await readOr(project.css);

	// The block above belongs to this package, so it is rewritten on every run
	// rather than left alone once it is there. That is what makes an upgrade
	// land: when a release changes which files a style imports, or where
	// `@source` has to point, the old lines would otherwise sit here and the
	// new components would come up unstyled.
	//
	// Only those lines. Everything below is the project's own CSS and is
	// carried over untouched — including an `@import` of another package, which
	// is why the match is anchored to this one.
	const stale =
		/^@import ['"]@nqmcreative\/ui\/[^'"]+\.css['"];$|^@source ['"][^'"]*@nqmcreative\/ui[^'"]*['"];$/;

	const kept = css
		.split('\n')
		.filter((line) => !stale.test(line.trim()))
		.join('\n')
		.replace(/@import ['"]tailwindcss['"];\n?/, '')
		.replace(/\/\* Tailwind v4 skips node_modules[\s\S]*?\*\/\n?/, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	const body = kept ? `${lines.join('\n')}\n\n${kept}\n` : `${lines.join('\n')}\n`;
	if (body === css) {
		skip(`${project.cssRel} already up to date`);
	} else {
		await write(project.css, body, project.cssRel);
	}

	// Laravel keeps its markup outside resources/css, so automatic detection
	// never reaches it. These are the project's own lines, not ours — printed
	// rather than written, so removing them stays possible.
	if (project.framework === 'laravel' && !/@source ['"]\.\.\/(js|views)/.test(body)) {
		log();
		warn(`Tailwind also has to see your own markup — add to ${project.cssRel}:`);
		log(c.cyan(`    @source '../js';`));
		log(c.cyan(`    @source '../views';`));
	}

	/* --- 2. the document head: font preconnect + no-flash theme --- */
	await wireHead(project, style);

	/* --- 3. remind about the vite plugin, which we will not rewrite --- */
	const viteConfig =
		['vite.config.ts', 'vite.config.js', 'vite.config.mjs']
			.map((f) => join(cwd, f))
			.find((f) => existsSync(f)) ?? null;
	const viteSource = viteConfig ? await readOr(viteConfig) : '';
	if (!viteSource.includes('@tailwindcss/vite')) {
		const plugins = {
			kit: `plugins: [tailwindcss(), sveltekit()]`,
			laravel: `plugins: [laravel({ input: ['${project.cssRel}', 'resources/js/app.js'] }), tailwindcss(), svelte()]`,
			vite: `plugins: [tailwindcss(), svelte()]`
		}[project.framework];
		const after = project.framework === 'kit' ? 'sveltekit()' : 'svelte()';

		log();
		warn(
			`add the Tailwind plugin to ${viteConfig ? relative(cwd, viteConfig) : 'your vite config'} — before ${after}:`
		);
		log(c.cyan(`    import tailwindcss from '@tailwindcss/vite';`));
		log(c.cyan(`    ${plugins}`));
	} else {
		skip('vite config already has the Tailwind plugin');
	}

	/* --- 4. import the CSS once --- */
	if (project.framework === 'laravel') {
		// Nothing imports it: the Blade layout hands the path to Vite, which is
		// also what makes `php artisan serve` pick up the built file.
		const blade = project.head ? await readOr(join(cwd, project.head)) : '';
		if (blade.includes(project.cssRel)) {
			skip(`${project.head} already loads ${project.cssRel}`);
		} else {
			log();
			warn(`load the CSS from your Blade layout, inside <head>:`);
			log(c.cyan(`    @vite(['${project.cssRel}', 'resources/js/app.js'])`));
		}
	} else if (project.framework === 'kit') {
		const layoutPath = join(cwd, project.entry);
		let layout = await readOr(layoutPath);
		const line = `import '../app.css';`;

		if (layout.includes('app.css')) {
			skip(`${project.entry} already imports the CSS`);
		} else if (!layout.trim()) {
			await write(
				layoutPath,
				`<script lang="ts">
	${line}

	let { children } = $props();
</script>

{@render children()}
`,
				project.entry
			);
		} else if (/<script[^>]*>/.test(layout)) {
			layout = layout.replace(/(<script[^>]*>\n)/, `$1\t${line}\n`);
			await write(layoutPath, layout, project.entry);
		} else {
			log();
			warn(`import the CSS once, at the top of ${project.entry}:`);
			log(c.cyan(`    ${line}`));
		}
	} else {
		// Plain Vite: the entry module is the one thing every page loads.
		const rel = project.entry
			? relative(dirname(join(cwd, project.entry)), project.css)
					.split(/[\\/]/)
					.join('/')
			: null;
		const line = rel ? `import '${rel.startsWith('.') ? rel : `./${rel}`}';` : null;

		if (!project.entry) {
			log();
			warn(`import ${project.cssRel} once, at the top of your entry module:`);
			log(c.cyan(`    import './${project.cssRel.split('/').pop()}';`));
		} else {
			const source = await readOr(join(cwd, project.entry));
			if (source.includes(line) || /import ['"][^'"]*app\.css['"]/.test(source)) {
				skip(`${project.entry} already imports the CSS`);
			} else {
				await write(join(cwd, project.entry), `${line}\n${source}`, project.entry);
			}
		}
	}

	log();
	log(`  Next: ${c.cyan(`bunx @nqmcreative/ui add button --style ${style.name}`)}`);
	log();
}

/* ------------------------------------------------------------------- add -- */

async function add() {
	const { components, styles } = await registry();
	const style = await pickStyle(styles);
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

    ${c.cyan('init')}                  wire one style into this project
    ${c.cyan('update')}                rewrite that wiring after upgrading the package
    ${c.cyan('add <name...>')}         print the import for a component
      ${c.dim('--to <file>')}         …and insert it into that file instead
    ${c.cyan('list [category]')}       every component in the catalogue
    ${c.cyan('info <name>')}           what one component pulls in, in every style

    ${c.dim('--style <s>')}           skip the picker: matte, paper or sprout
    ${c.dim('--dry-run')}             show the writes without making them

  ${c.dim('Every style implements every component. Run init once per project,')}
  ${c.dim('then update after each upgrade — it overwrites the lines it owns.')}
`);
}

/* ------------------------------------------------------------------ main -- */

// `update` is `init` under the name people reach for after an upgrade: both
// rewrite the lines this CLI owns and leave the rest of the file alone.
const commands = { init, update: init, add, list, info };
if (!command || flags.has('--help') || command === 'help') {
	help();
} else if (commands[command]) {
	await commands[command]();
} else {
	fail(`unknown command "${command}" — try \`nqm-ui --help\``);
}
