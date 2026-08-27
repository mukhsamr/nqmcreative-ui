<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import { TONES } from '$lib/core/tones.js';

	// An async onclick is the whole feature: the button spins and locks itself
	// for as long as the promise runs, and no state is needed out here.
	let saved = $state(0);
	let failed = $state(0);

	const save = () =>
		new Promise<void>((resolve) =>
			setTimeout(() => {
				saved += 1;
				resolve();
			}, 1200)
		);

	// A handler catches its own failures — the button unlocks either way.
	const flaky = () =>
		new Promise<void>((_, reject) => setTimeout(() => reject(new Error('offline')), 1200)).catch(
			() => {
				failed += 1;
			}
		);
</script>

{#snippet plus()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
	</svg>
{/snippet}

{#snippet arrow()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/snippet}

{#snippet trash()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5 5 13h6l.5-8.5"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

<div class="flex w-full flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">variant</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button variant="solid">Solid</Button>
			<Button variant="soft">Soft</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">tone</p>
		<div class="flex flex-wrap items-center gap-3">
			{#each TONES as tone (tone)}
				<Button {tone} size="sm">{tone}</Button>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">size</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
			<Button size="xl">Extra large</Button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">icon</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button icon={plus}>New project</Button>
			<Button variant="outline" iconEnd={arrow}>Continue</Button>
			<Button variant="soft" icon={plus} iconEnd={arrow}>Both</Button>
			<Button variant="ghost" tone="danger" iconOnly icon={trash} aria-label="Delete project" />
			<Button variant="link" iconEnd={arrow}>Read the docs</Button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">state</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button loading>Saving</Button>
			<Button variant="outline" loading>Checking</Button>
			<Button disabled>Disabled</Button>
			<Button icon={plus} disabled>Disabled with icon</Button>
		</div>
		<div class="max-w-sm pt-1">
			<Button block>Block</Button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">
			submit — an async onclick spins and locks the button on its own
		</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button type="submit" icon={plus} onclick={save}>Save changes</Button>
			<Button variant="outline" tone="danger" onclick={flaky}>Sync (fails)</Button>
			<span class="font-mono text-xs text-text-muted">
				saved {saved} · failed {failed}
			</span>
		</div>
	</div>
</div>
