import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
// `vitest/config` rather than `vite`, so the `test` block type-checks.
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The docs site is fully prerendered, so Cloudflare serves it as static
			// files with a Worker only for the 404 fallback.
			adapter: adapter(),

			// The site lives outside src/lib so svelte-package does not ship the
			// docs — demos, snippets and all — to consumers.
			alias: { $site: 'src/site' }
		})
	],

	server: {
		port: 5183,
		strictPort: true
	},

	test: {
		// The components under test touch the DOM (mount, ResizeObserver, files),
		// so every suite runs in happy-dom rather than node.
		environment: 'happy-dom',
		include: ['src/**/*.test.ts']
	},

	// Under Vitest, resolve Svelte's browser build rather than the SSR one —
	// otherwise `mount()` throws `lifecycle_function_unavailable`.
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
