<script lang="ts">
	import Field from '$lib/styles/matte/Field.svelte';
	import Input from '$lib/styles/matte/Input.svelte';
	import InputGroup from '$lib/styles/matte/InputGroup.svelte';
	import Button from '$lib/styles/matte/Button.svelte';
	import Select from '$lib/styles/matte/Select.svelte';
	import Textarea from '$lib/styles/matte/Textarea.svelte';

	let text = $state('Nadia Qanita');
	let mail = $state('nadia@studio.com');
	let secret = $state('rahasia');
	let revealed = $state(false);
	let seats = $state('3');
	let site = $state('');
	let plan = $state('studio');
	let brief = $state('');

	// Validation lives in the demo, not the component: a field is only red once
	// it has been typed in, and the message replaces the hint.
	let signupMail = $state('nadia@');
	let signupPass = $state('nqm');
	let signupSeats = $state('12');

	const mailError = $derived(
		signupMail.length === 0
			? ''
			: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(signupMail)
				? ''
				: 'Enter a valid email address.'
	);
	const passError = $derived(
		signupPass.length === 0 ? '' : signupPass.length < 8 ? 'Use at least 8 characters.' : ''
	);
	const seatsError = $derived(Number(signupSeats) > 10 ? 'This plan tops out at 10 seats.' : '');
	const valid = $derived(!mailError && !passError && !seatsError && signupMail.length > 0);
</script>

{#snippet magnifier()}
	<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="7" cy="7" r="4.2" stroke="currentColor" stroke-width="1.4" />
		<path d="m10.2 10.2 3 3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<div class="flex w-full flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">type</p>
		<div class="grid gap-4 sm:grid-cols-2">
			<Field label="Full name" for="iv-text">
				<Input id="iv-text" bind:value={text} placeholder="Nadia Q." />
			</Field>
			<Field label="Work email" for="iv-mail">
				<Input id="iv-mail" bind:value={mail} type="email" placeholder="you@studio.com" />
			</Field>
			<Field label="Password" hint="The suffix slot carries the reveal toggle." for="iv-pass">
				<Input
					id="iv-pass"
					bind:value={secret}
					type={revealed ? 'text' : 'password'}
					placeholder="••••••••"
				>
					{#snippet suffix()}
						<button
							type="button"
							onclick={() => (revealed = !revealed)}
							aria-pressed={revealed}
							class="font-mono text-[10px] tracking-wide uppercase transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
						>
							{revealed ? 'Hide' : 'Show'}
						</button>
					{/snippet}
				</Input>
			</Field>
			<Field label="Seats" for="iv-seats">
				<Input id="iv-seats" bind:value={seats} type="number" min={1} max={10}>
					{#snippet suffix()}<span class="font-mono text-xs">seats</span>{/snippet}
				</Input>
			</Field>
			<Field label="Search" for="iv-search">
				<Input id="iv-search" type="search" placeholder="Search projects…">
					{#snippet prefix()}{@render magnifier()}{/snippet}
				</Input>
			</Field>
			<Field label="Website" for="iv-url">
				<Input id="iv-url" bind:value={site} type="url" placeholder="studio">
					{#snippet prefix()}<span class="font-mono text-xs">https://</span>{/snippet}
					{#snippet suffix()}<span class="font-mono text-xs">.com</span>{/snippet}
				</Input>
			</Field>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">size</p>
		<div class="flex max-w-sm flex-col gap-3">
			<Input size="sm" placeholder="Small" />
			<Input size="md" placeholder="Medium" />
			<Input size="lg" placeholder="Large" />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">state</p>
		<div class="grid gap-4 sm:grid-cols-2">
			<Field label="Default" hint="Helper text sits under the field." for="iv-default">
				<Input id="iv-default" placeholder="you@studio.com" />
			</Field>
			<Field label="Invalid" error="That address is already registered." for="iv-invalid">
				<Input id="iv-invalid" invalid value="nadia@studio.com" />
			</Field>
			<Field label="Disabled" for="iv-disabled">
				<Input id="iv-disabled" disabled value="Locked by the workspace owner" />
			</Field>
			<Field label="Read-only" for="iv-readonly">
				<Input id="iv-readonly" readonly value="INV-2026-014" />
			</Field>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">
			validation — messages appear as you type
		</p>
		<div class="flex max-w-md flex-col gap-4">
			<Field
				label="Work email"
				required
				for="iv-vmail"
				hint="We send the invoice here."
				error={mailError}
			>
				<Input
					id="iv-vmail"
					bind:value={signupMail}
					type="email"
					invalid={!!mailError}
					placeholder="you@studio.com"
				/>
			</Field>
			<Field
				label="Password"
				required
				for="iv-vpass"
				hint="At least 8 characters."
				error={passError}
			>
				<Input
					id="iv-vpass"
					bind:value={signupPass}
					type="password"
					invalid={!!passError}
					placeholder="••••••••"
				/>
			</Field>
			<Field label="Seats" for="iv-vseats" hint="1–10 on the studio plan." error={seatsError}>
				<Input
					id="iv-vseats"
					bind:value={signupSeats}
					type="number"
					min={1}
					max={20}
					invalid={!!seatsError}
				/>
			</Field>
			<Button disabled={!valid}>Create account</Button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">other controls</p>
		<div class="flex max-w-md flex-col gap-4">
			<Field label="Plan" for="iv-plan">
				<Select
					id="iv-plan"
					bind:value={plan}
					options={[
						{ value: 'studio', label: 'Studio' },
						{ value: 'agency', label: 'Agency' },
						{ value: 'custom', label: 'Custom', disabled: true }
					]}
				/>
			</Field>
			<Field label="Brief" hint="Markdown is fine." for="iv-brief">
				<Textarea id="iv-brief" bind:value={brief} placeholder="Tell us about the project…" />
			</Field>
			<Field label="Newsletter" for="iv-group">
				<InputGroup>
					<Input id="iv-group" type="email" placeholder="you@studio.com" />
					<Button>Subscribe</Button>
				</InputGroup>
			</Field>
		</div>
	</div>
</div>
