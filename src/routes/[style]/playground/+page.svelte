<script lang="ts">
	import { UI } from '$site/ui.js';
	import { TONES, enUS, idID, toast } from '$lib/core/index.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);

	let name = $state('');
	let brief = $state('');
	let plan = $state('studio');
	let terms = $state(true);
	let notify = $state(false);
	let billing = $state('monthly');
	let tab = $state('overview');
	let page = $state(3);
	let modalOpen = $state(false);
	let drawerOpen = $state(false);
	let confirmOpen = $state(false);
	let paletteOpen = $state(false);
	let lang = $state('en');
	let view = $state('grid');
	let perks = $state<string[]>(['wifi']);
	let deadline = $state('');
	let kickoff = $state('2026-09-14');
	let skills = $state<string[]>(['brand', 'motion']);
	let password = $state('nqm');
	let quantity = $state('3');
	let revealed = $state(false);
	let opacity = $state(65);
	let delivery = $state('standard');
	let city = $state('');
	let search = $state('');
	let uploads = $state<File[]>([]);
	let lookup = $state('');
	let found = $state('');
	let domain = $state('sundara');
	let amount = $state<number | null>(84000000);
	let slot = $state('09:30');
	let topics = $state(['brand', 'motion']);
	let accent = $state('#0f766e');
	let logo = $state<File[]>([]);
	let otp = $state('');
	let sort = $state<{ key: string; direction: 'asc' | 'desc' } | null>(null);
	let picked = $state<string[]>([]);

	const cities = [
		{ value: 'jkt', label: 'Jakarta', description: 'DKI Jakarta', group: 'Jawa' },
		{ value: 'bdg', label: 'Bandung', description: 'Jawa Barat', group: 'Jawa' },
		{ value: 'sby', label: 'Surabaya', description: 'Jawa Timur', group: 'Jawa' },
		{ value: 'dps', label: 'Denpasar', description: 'Bali', group: 'Luar Jawa' },
		{ value: 'mks', label: 'Makassar', description: 'Sulawesi Selatan', group: 'Luar Jawa' },
		{ value: 'mdn', label: 'Medan', description: 'Sumatera Utara', group: 'Luar Jawa' }
	];

	const projects = [
		{ id: 'p1', project: 'Sundara Rebrand', client: 'Sundara', status: 'Live', budget: 84000000 },
		{
			id: 'p2',
			project: 'Nusantara Coffee',
			client: 'NC Group',
			status: 'In review',
			budget: 52500000
		},
		{ id: 'p3', project: 'Kelana Travel App', client: 'Kelana', status: 'Draft', budget: 120000000 }
	];

	const money = new Intl.NumberFormat('id-ID');

	const statusTone = { Live: 'success', 'In review': 'warning', Draft: 'neutral' } as const;

	const swatches = [
		{ tone: 'brand', base: 'bg-brand', light: 'bg-brand-light' },
		{ tone: 'accent', base: 'bg-accent', light: 'bg-accent-light' },
		{ tone: 'violet', base: 'bg-violet', light: 'bg-violet-light' },
		{ tone: 'info', base: 'bg-info', light: 'bg-info-light' },
		{ tone: 'success', base: 'bg-success', light: 'bg-success-light' },
		{ tone: 'warning', base: 'bg-warning', light: 'bg-warning-light' },
		{ tone: 'danger', base: 'bg-danger', light: 'bg-danger-light' },
		{ tone: 'neutral', base: 'bg-neutral', light: 'bg-neutral-light' }
	];
</script>

<ui.LocaleProvider locale={lang === 'id' ? idID : enUS}>
	<div class="min-h-screen bg-bg px-6 py-16 text-text">
		<div class="mx-auto flex max-w-4xl flex-col gap-16">
			<header class="flex flex-col gap-3">
				<div class="flex items-start justify-between gap-4">
					<ui.Breadcrumb items={[{ label: 'Design system', href: '#' }, { label: 'Components' }]} />
					<div class="flex items-center gap-3">
						<ui.SegmentedControl
							bind:value={lang}
							size="sm"
							tone="violet"
							label="Language"
							options={[
								{ value: 'en', label: 'EN' },
								{ value: 'id', label: 'ID' }
							]}
						/>
						<ui.ThemeToggle variant="segmented" />
					</div>
				</div>
				<span class="font-mono text-xs tracking-wide text-brand uppercase">@nqmcreative/ui</span>
				<h1 class="font-heading text-4xl font-medium tracking-tight">Component preview</h1>
				<p class="max-w-xl text-text-secondary">
					Flat surfaces, no shadows, no radius except pills. Brand teal is the primary tone — every
					component also takes a <code class="font-mono text-sm text-brand">tone</code> prop for the seven
					other hues.
				</p>
			</header>

			<!-- palette -->
			<section class="flex flex-col gap-4">
				<h2 class="font-heading text-lg font-medium">Palette</h2>
				<div class="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
					{#each swatches as swatch (swatch.tone)}
						<div class="flex flex-col gap-2 bg-bg p-4">
							<div class="flex h-10 items-stretch">
								<span class="flex-1 {swatch.base}"></span>
								<span class="flex-1 {swatch.light}"></span>
							</div>
							<span class="font-mono text-xs text-text-secondary">{swatch.tone}</span>
						</div>
					{/each}
				</div>
				<p class="font-mono text-xs text-text-muted">
					each tone ships base / hover / light / border steps
				</p>
			</section>

			<!-- buttons -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Buttons</h2>
				<div class="flex flex-wrap items-center gap-3">
					<ui.Button variant="solid">Solid</ui.Button>
					<ui.Button variant="soft">Soft</ui.Button>
					<ui.Button variant="outline">Outline</ui.Button>
					<ui.Button variant="ghost">Ghost</ui.Button>
					<ui.Button variant="link">Link →</ui.Button>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					{#each TONES as tone (tone)}
						<ui.Button {tone} size="sm" variant="soft">{tone}</ui.Button>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<ui.Button size="sm">Small</ui.Button>
					<ui.Button size="md">Medium</ui.Button>
					<ui.Button size="lg">Large</ui.Button>
					<ui.Button size="xl">Extra large</ui.Button>
					<ui.Button loading>Saving</ui.Button>
					<ui.Button tone="danger" disabled>Disabled</ui.Button>
				</div>
			</section>

			<!-- badges -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Badges</h2>
				<div class="flex flex-wrap items-center gap-3">
					{#each TONES as tone (tone)}
						<ui.Badge {tone} dot>{tone}</ui.Badge>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<ui.Badge variant="solid" tone="brand">Solid</ui.Badge>
					<ui.Badge variant="outline" tone="accent">Outline</ui.Badge>
					<ui.Badge variant="soft" tone="violet" size="sm">Small</ui.Badge>
				</div>
			</section>

			<!-- forms -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Forms</h2>
				<div class="grid gap-6 sm:grid-cols-2">
					<ui.Field label="Full name" hint="Shown on the invoice." required for="name">
						<ui.Input id="name" bind:value={name} placeholder="Nadia Q." />
					</ui.Field>
					<ui.Field label="Work email" error="That address is already registered." for="email">
						<ui.Input id="email" invalid placeholder="you@studio.com" type="email" />
					</ui.Field>
					<ui.Field label="Plan" for="plan">
						<ui.Select
							id="plan"
							bind:value={plan}
							options={[
								{ value: 'studio', label: 'Studio' },
								{ value: 'agency', label: 'Agency' },
								{ value: 'custom', label: 'Custom', disabled: true }
							]}
						/>
					</ui.Field>
					<ui.Field label="Budget" hint="Numbers only." for="budget">
						<ui.Input id="budget" placeholder="50.000.000" tone="accent">
							{#snippet prefix()}
								<span class="font-mono text-xs">Rp</span>
							{/snippet}
						</ui.Input>
					</ui.Field>
				</div>

				<ui.Field label="Project brief" hint="Markdown supported." for="brief">
					<ui.Textarea id="brief" bind:value={brief} placeholder="Tell us about the project…" />
				</ui.Field>

				<div class="flex flex-col gap-3">
					<ui.Checkbox
						bind:checked={terms}
						label="I agree to the terms"
						description="Standard MSA."
					/>
					<ui.Checkbox indeterminate label="Partially selected" tone="violet" />
					<ui.Checkbox label="Disabled option" disabled />
				</div>

				<ui.Divider label="or" />

				<div class="flex flex-col gap-3">
					<ui.Radio bind:group={billing} value="monthly" label="Monthly billing" />
					<ui.Radio
						bind:group={billing}
						value="yearly"
						label="Yearly billing"
						description="Save 20%."
						tone="success"
					/>
				</div>

				<ui.Switch
					bind:checked={notify}
					label="Email notifications"
					description="Weekly digest only."
					tone="info"
				/>
			</section>

			<!-- feedback -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Feedback</h2>
				<ui.Alert tone="info" title="Heads up">Rendering takes about two minutes.</ui.Alert>
				<ui.Alert tone="success" variant="accent" title="Deployed">Live on production.</ui.Alert>
				<ui.Alert tone="warning" variant="outline" title="Quota at 85%" dismissible>
					Upgrade before the end of the cycle.
				</ui.Alert>
				<ui.Alert tone="danger" title="Payment failed">The card ending 4242 was declined.</ui.Alert>

				<div class="grid gap-6 sm:grid-cols-2">
					<ui.Progress value={72} label="Storage" showValue tone="brand" />
					<ui.Progress value={38} label="Render queue" showValue tone="accent" size="lg" />
				</div>

				<div class="flex items-center gap-6">
					<ui.Spinner size="sm" tone="brand" />
					<ui.Spinner size="md" tone="accent" />
					<ui.Spinner size="lg" tone="violet" />
				</div>

				<ui.Card>
					<ui.Skeleton variant="text" lines={3} />
				</ui.Card>
			</section>

			<!-- data display -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Data display</h2>

				<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
					<div class="bg-bg p-6">
						<ui.Stat label="Revenue" value="1,2M" delta="12.4%" trend="up" />
					</div>
					<div class="bg-bg p-6">
						<ui.Stat label="Churn" value="2.1%" delta="0.4%" trend="down" tone="danger" />
					</div>
					<div class="bg-bg p-6">
						<ui.Stat label="Active projects" value="18" hint="Across 9 clients" tone="brand" />
					</div>
				</div>

				<ui.Table
					columns={[
						{ key: 'project', label: 'Project', sortable: true },
						{ key: 'client', label: 'Client', sortable: true },
						{ key: 'status', label: 'Status' },
						{
							key: 'budget',
							label: 'Budget',
							align: 'right',
							class: 'font-mono text-sm',
							sortable: true
						}
					]}
					rows={projects}
					bind:sort
					selectable
					bind:selected={picked}
				>
					{#snippet cell({ row, column, value })}
						{#if column.key === 'status'}
							<ui.Badge tone={statusTone[row.status as keyof typeof statusTone]} size="sm">
								{row.status}
							</ui.Badge>
						{:else if column.key === 'budget'}
							{money.format(value as number)}
						{:else}
							{value}
						{/if}
					{/snippet}
				</ui.Table>
				<p class="font-mono text-sm text-text-muted">
					selected: {picked.length ? picked.join(', ') : '(none)'} · sort: {sort
						? `${sort.key} ${sort.direction}`
						: '(none)'}
				</p>

				<div class="flex flex-wrap items-center gap-6">
					<ui.AvatarGroup>
						<ui.Avatar name="Nadia Q" tone="brand" />
						<ui.Avatar name="Rafi A" tone="accent" />
						<ui.Avatar name="Sita M" tone="violet" />
						<ui.Avatar name="Dwi Pratama" tone="neutral" />
					</ui.AvatarGroup>
					<ui.Avatar name="Nadia Q" size="lg" squared tone="info" />
					<span class="font-sans text-sm text-text-secondary">
						Press <ui.Kbd>⌘</ui.Kbd>
						<ui.Kbd>K</ui.Kbd> to search
					</span>
				</div>

				<ui.Pagination bind:page total={12} />
			</section>

			<!-- navigation -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Navigation</h2>

				<ui.Tabs
					bind:value={tab}
					items={[
						{ value: 'overview', label: 'Overview' },
						{ value: 'assets', label: 'Assets', badge: 24 },
						{ value: 'billing', label: 'Billing' },
						{ value: 'archive', label: 'Archive', disabled: true }
					]}
				/>
				<p class="font-mono text-sm text-text-muted">active: {tab}</p>

				<div class="flex flex-wrap gap-6">
					<ui.Tabs
						variant="pill"
						tone="accent"
						items={[
							{ value: 'a', label: 'Pill' },
							{ value: 'b', label: 'Variant' }
						]}
					/>
					<ui.Tabs
						variant="segmented"
						tone="violet"
						items={[
							{ value: 'a', label: 'Segmented' },
							{ value: 'b', label: 'Variant' }
						]}
					/>
				</div>

				<ui.Accordion>
					<ui.AccordionItem title="What does the retainer include?" meta="01" open>
						Strategy, design and two rounds of revision per sprint.
					</ui.AccordionItem>
					<ui.AccordionItem title="How fast is onboarding?" meta="02" tone="accent">
						Kick-off within five business days of the signed SOW.
					</ui.AccordionItem>
					<ui.AccordionItem title="Can we pause a sprint?" meta="03" tone="violet">
						Yes — with 14 days notice, once per quarter.
					</ui.AccordionItem>
				</ui.Accordion>
			</section>

			<!-- overlay & empty -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Overlay & empty states</h2>

				<div class="flex flex-wrap items-center gap-4">
					<ui.Button onclick={() => (modalOpen = true)}>Open modal</ui.Button>
					<ui.Tooltip content="Flat, CSS-only tooltip">
						<ui.Button variant="outline" tone="neutral">Hover me</ui.Button>
					</ui.Tooltip>
					<ui.Link href="https://nqmcreative.com" external>nqmcreative.com</ui.Link>
					<ui.Link href="#" tone="accent" underline="always">Accent link</ui.Link>
				</div>

				<ui.EmptyState
					title="No projects yet"
					description="Create your first project to see it listed here."
					tone="brand"
				>
					{#snippet action()}
						<ui.Button size="sm">New project</ui.Button>
						<ui.Button size="sm" variant="ghost" tone="neutral">Import</ui.Button>
					{/snippet}
				</ui.EmptyState>

				<ui.Modal
					bind:open={modalOpen}
					title="Archive this project?"
					description="It stays readable but stops accepting new work."
				>
					Archiving moves <strong class="text-text">Sundara Rebrand</strong> out of the active list.
					You can restore it at any time.
					{#snippet footer()}
						<ui.Button variant="ghost" tone="neutral" onclick={() => (modalOpen = false)}
							>Cancel</ui.Button
						>
						<ui.Button tone="danger" onclick={() => (modalOpen = false)}>Archive</ui.Button>
					{/snippet}
				</ui.Modal>
			</section>

			<!-- overlays -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Menus, popovers & drawers</h2>

				<div class="flex flex-wrap items-center gap-4">
					<ui.Dropdown>
						{#snippet trigger()}
							<ui.Button variant="outline" tone="neutral">Actions ▾</ui.Button>
						{/snippet}
						<ui.MenuSeparator label="This project" />
						<ui.MenuItem shortcut="⌘E">Edit brief</ui.MenuItem>
						<ui.MenuItem shortcut="⌘D">Duplicate</ui.MenuItem>
						<ui.MenuItem selected>Notify the client</ui.MenuItem>
						<ui.MenuSeparator />
						<ui.MenuItem tone="danger" shortcut="⌫">Delete project</ui.MenuItem>
					</ui.Dropdown>

					<ui.Dropdown placement="bottom-end" matchWidth={false}>
						{#snippet trigger()}
							<ui.Button variant="soft" tone="violet">Assign to ▾</ui.Button>
						{/snippet}
						<ui.MenuItem>Nadia Q.</ui.MenuItem>
						<ui.MenuItem>Rafi A.</ui.MenuItem>
						<ui.MenuItem disabled>Sita M. (away)</ui.MenuItem>
					</ui.Dropdown>

					<ui.Popover title="Retainer scope">
						{#snippet trigger()}
							<ui.Button variant="ghost" tone="info">What's included?</ui.Button>
						{/snippet}
						Strategy, design and two rounds of revision per sprint. Extra rounds are billed at the hourly
						rate.
					</ui.Popover>

					<ui.Popover on="hover" placement="top" trapFocus={false}>
						{#snippet trigger()}
							<ui.Button variant="ghost" tone="neutral">Hover card</ui.Button>
						{/snippet}
						Opens on hover and on keyboard focus, and stays open while the pointer is inside it.
					</ui.Popover>

					<ui.Button onclick={() => (drawerOpen = true)}>Open drawer</ui.Button>
				</div>

				<ui.Drawer
					bind:open={drawerOpen}
					title="Project settings"
					description="Applies to this project only."
				>
					<div class="flex flex-col gap-6">
						<ui.Field label="Visibility" for="vis">
							<ui.Select
								id="vis"
								options={[
									{ value: 'team', label: 'Team only' },
									{ value: 'client', label: 'Team + client' },
									{ value: 'public', label: 'Public' }
								]}
							/>
						</ui.Field>
						<ui.Switch label="Weekly digest" description="Sent every Monday." tone="brand" />
						<ui.Slider
							label="Render quality"
							showValue
							unit="%"
							bind:value={opacity}
							marks={[0, 100]}
						/>
					</div>
					{#snippet footer()}
						<ui.Button variant="ghost" tone="neutral" onclick={() => (drawerOpen = false)}
							>Cancel</ui.Button
						>
						<ui.Button
							onclick={() => {
								drawerOpen = false;
								toast.success('Settings saved');
							}}>Save</ui.Button
						>
					{/snippet}
				</ui.Drawer>
			</section>

			<!-- toasts -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Toasts</h2>
				<div class="flex flex-wrap items-center gap-3">
					<ui.Button
						size="sm"
						tone="success"
						variant="soft"
						onclick={() => toast.success('Project archived')}
					>
						Success
					</ui.Button>
					<ui.Button
						size="sm"
						tone="danger"
						variant="soft"
						onclick={() =>
							toast.error('Upload failed', { description: 'The file is over the 25 MB limit.' })}
					>
						Error
					</ui.Button>
					<ui.Button
						size="sm"
						tone="warning"
						variant="soft"
						onclick={() =>
							toast.warning('Storage at 85%', { action: { label: 'Upgrade', onclick: () => {} } })}
					>
						With action
					</ui.Button>
					<ui.Button
						size="sm"
						tone="brand"
						variant="soft"
						onclick={() => {
							const id = toast.loading('Rendering…');
							setTimeout(() => toast.update(id, 'Render complete', { tone: 'success' }), 2000);
						}}
					>
						Loading → done
					</ui.Button>
				</div>
				<p class="font-mono text-xs text-text-muted">
					fired from a module-level store; one &lt;Toaster /&gt; is mounted at the bottom of this
					page
				</p>
			</section>

			<!-- advanced form controls -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Advanced form controls</h2>

				<div class="grid gap-6 sm:grid-cols-2">
					<ui.Field label="Password" hint="Toggled by the suffix button." for="pw">
						<ui.Input
							id="pw"
							type={revealed ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
						>
							{#snippet suffix()}
								<button
									type="button"
									onclick={() => (revealed = !revealed)}
									class="font-mono text-[11px] uppercase"
								>
									{revealed ? 'Hide' : 'Show'}
								</button>
							{/snippet}
						</ui.Input>
					</ui.Field>

					<ui.Field label="Quantity" for="qty">
						<ui.Input id="qty" type="number" bind:value={quantity} min={1} max={20} />
					</ui.Field>

					<ui.Field label="City" hint="Type to filter, arrows to move." for="city">
						<ui.Combobox
							id="city"
							bind:value={city}
							options={cities}
							placeholder="Search cities…"
						/>
					</ui.Field>

					<ui.Field label="Search projects" for="q">
						<ui.InputGroup>
							<ui.Input id="q" bind:value={search} placeholder="Keyword" />
							<ui.Button
								tone="brand"
								onclick={() => toast.info(`Searching “${search || 'everything'}”`)}
							>
								Search
							</ui.Button>
						</ui.InputGroup>
					</ui.Field>
				</div>

				<ui.Slider
					label="Opacity"
					bind:value={opacity}
					showValue
					unit="%"
					tone="accent"
					marks={[0, 50, 100]}
				/>

				<ui.RadioGroup
					legend="Delivery"
					bind:value={delivery}
					boxed
					orientation="horizontal"
					tone="brand"
					options={[
						{ value: 'standard', label: 'Standard', description: '5–7 business days' },
						{ value: 'express', label: 'Express', description: '2 business days' },
						{ value: 'rush', label: 'Rush', description: 'Next morning', disabled: true }
					]}
				/>
			</section>

			<!-- dropzone -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">File upload</h2>
				<ui.Dropzone
					bind:files={uploads}
					accept="image/*,.pdf"
					maxSize={5 * 1024 * 1024}
					maxFiles={4}
					tone="brand"
					label="Drop brand assets here"
					onaccept={(files) => toast.success(`${files.length} file(s) added`)}
					onreject={(bad) => toast.error(`${bad.length} file(s) rejected`)}
				/>
			</section>

			<!-- the specialised fields -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Specialised fields</h2>

				<div class="grid gap-5 sm:grid-cols-2">
					<ui.Field label="Find a project" hint="Runs 300ms after you stop typing.">
						<ui.SearchInput
							bind:value={lookup}
							debounce={300}
							placeholder="Keyword"
							onsearch={(next) => (found = next)}
						/>
					</ui.Field>

					<ui.Field label="Studio domain">
						<ui.InputGroup>
							<ui.InputAddon>https://</ui.InputAddon>
							<ui.Input bind:value={domain} placeholder="sundara" />
							<ui.InputAddon>.com</ui.InputAddon>
						</ui.InputGroup>
					</ui.Field>

					<ui.Field label="Budget" hint="Grouped on blur — the bound value stays a number.">
						<ui.CurrencyInput
							bind:value={amount}
							currency="Rp"
							group="."
							decimal=","
							precision={0}
							min={0}
						/>
					</ui.Field>

					<ui.Field label="Kickoff time">
						<ui.TimeInput bind:value={slot} min="08:00" max="17:00" step={15} />
					</ui.Field>

					<ui.Field label="Topics" hint="Enter or a comma commits. Six at most.">
						<ui.TagsInput
							bind:tags={topics}
							max={6}
							tone="accent"
							onreject={(reason) => toast.error(`Tag refused: ${reason}`)}
						/>
					</ui.Field>

					<ui.Field label="Brand colour">
						<ui.ColorInput
							bind:value={accent}
							swatches={['#0f766e', '#b45309', '#1d4ed8', '#be123c', '#111827']}
						/>
					</ui.Field>

					<ui.Field label="Logo" hint="One file, 2 MB.">
						<ui.FileInput
							bind:files={logo}
							accept="image/*"
							maxSize={2 * 1024 * 1024}
							onreject={(bad) => toast.error(`${bad.length} file(s) rejected`)}
						/>
					</ui.Field>

					<ui.Field label="Verification code" hint="Paste all six at once.">
						<ui.PinInput
							bind:value={otp}
							length={6}
							groupAfter={3}
							oncomplete={(code) => toast.success(`Code ${code} submitted`)}
						/>
					</ui.Field>
				</div>

				<p class="font-mono text-xs text-text-muted">
					{found ? `searching “${found}”` : 'nothing searched yet'} · {topics.length} topics ·
					{amount === null ? 'no budget' : money.format(amount)} · {slot || 'no time'} · {accent}
				</p>
			</section>

			<!-- command, confirm, context menu -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Command, confirm & context menu</h2>

				<div class="flex flex-wrap items-center gap-4">
					<ui.Button variant="outline" tone="neutral" onclick={() => (paletteOpen = true)}>
						Open palette <ui.Kbd>⌘</ui.Kbd><ui.Kbd>K</ui.Kbd>
					</ui.Button>
					<ui.Button tone="danger" variant="soft" onclick={() => (confirmOpen = true)}>
						Delete project…
					</ui.Button>
				</div>

				<ui.ContextMenu>
					{#snippet menu()}
						<ui.MenuSeparator label="Row" />
						<ui.MenuItem shortcut="⌘C">Copy</ui.MenuItem>
						<ui.MenuItem shortcut="⌘D">Duplicate</ui.MenuItem>
						<ui.MenuSeparator />
						<ui.MenuItem tone="danger">Remove</ui.MenuItem>
					{/snippet}
					<div
						class="flex h-28 items-center justify-center border border-dashed border-hairline-strong bg-bg-alt font-sans text-sm text-text-muted"
					>
						Right-click anywhere in this area
					</div>
				</ui.ContextMenu>

				<ui.CommandPalette
					bind:open={paletteOpen}
					items={[
						{ id: 'new', label: 'New project', group: 'Create', shortcut: '⌘N' },
						{ id: 'invite', label: 'Invite a teammate', group: 'Create' },
						{ id: 'settings', label: 'Open settings', group: 'Navigate', keywords: 'preferences' },
						{ id: 'billing', label: 'Billing & invoices', group: 'Navigate' },
						{ id: 'archive', label: 'Archive project', group: 'Danger', disabled: true }
					]}
					onselect={(item) => toast.info(`Ran “${item.label}”`)}
				/>

				<ui.ConfirmDialog
					bind:open={confirmOpen}
					title="Delete this project?"
					description="Everything in Sundara Rebrand goes with it. This cannot be undone."
					confirmLabel="Delete"
					onconfirm={async () => {
						await new Promise((r) => setTimeout(r, 900));
						toast.success('Project deleted');
					}}
				/>
			</section>

			<!-- grouped choice controls -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Grouped choice controls</h2>

				<ui.SegmentedControl
					bind:value={view}
					label="View"
					options={[
						{ value: 'grid', label: 'Grid' },
						{ value: 'list', label: 'List' },
						{ value: 'board', label: 'Board' },
						{ value: 'gantt', label: 'Gantt', disabled: true }
					]}
				/>

				<ui.CheckboxGroup
					legend="Included in the studio"
					bind:value={perks}
					max={3}
					hint="Pick up to three."
					orientation="horizontal"
					boxed
					tone="accent"
					options={[
						{ value: 'wifi', label: 'Fibre wifi' },
						{ value: 'coffee', label: 'Barista coffee' },
						{ value: 'studio', label: 'Photo studio' },
						{ value: 'parking', label: 'Parking' }
					]}
				/>
			</section>

			<!-- dates & multi select -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Dates & multi select</h2>

				<div class="grid gap-6 sm:grid-cols-2">
					<ui.Field label="Deadline" hint="Type it, or pick from the calendar." for="deadline">
						<ui.DatePicker id="deadline" bind:value={deadline} min="2026-01-01" />
					</ui.Field>

					<ui.Field label="Kick-off" hint="Weekends are blocked out." for="kickoff">
						<ui.DatePicker
							id="kickoff"
							bind:value={kickoff}
							tone="accent"
							isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
						/>
					</ui.Field>
				</div>

				<p class="font-mono text-sm text-text-muted">
					deadline: {deadline || '(empty)'} · kick-off: {kickoff || '(empty)'}
				</p>

				<ui.Field label="Skills needed" hint="Up to four." for="skills">
					<ui.MultiSelect
						id="skills"
						bind:value={skills}
						max={4}
						tone="violet"
						options={[
							{ value: 'brand', label: 'Brand identity', group: 'Design' },
							{ value: 'ui', label: 'Product UI', group: 'Design' },
							{ value: 'motion', label: 'Motion', group: 'Design' },
							{ value: 'copy', label: 'Copywriting', group: 'Content' },
							{ value: 'photo', label: 'Photography', group: 'Content' },
							{ value: 'dev', label: 'Front-end build', group: 'Build' }
						]}
					/>
				</ui.Field>

				<div class="flex flex-wrap items-start gap-6">
					<div class="border border-hairline">
						<ui.Calendar bind:value={kickoff} tone="accent" />
					</div>
					<p class="max-w-xs font-sans text-sm text-text-secondary">
						<code class="font-mono text-xs">Calendar</code> stands alone, and both it and
						<code class="font-mono text-xs">DatePicker</code> follow the locale — switch to
						<strong class="text-text">ID</strong> above and the month names, weekday order and input format
						change with it.
					</p>
				</div>
			</section>

			<!-- cards -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Cards</h2>
				<div class="grid gap-6 sm:grid-cols-3">
					<ui.Card eyebrow="Outline" title="Default" interactive>
						<p class="text-sm text-text-secondary">Hairline border on white.</p>
					</ui.Card>
					<ui.Card variant="filled" eyebrow="Filled" title="Alt surface">
						<p class="text-sm text-text-secondary">Sits on the alt surface.</p>
					</ui.Card>
					<ui.Card variant="tinted" tone="accent" eyebrow="Tinted" title="Accent">
						<p class="text-sm text-text-secondary">Uses the tone's light step.</p>
					</ui.Card>
				</div>
				<ui.Card accent tone="violet" title="With footer">
					<p class="text-sm text-text-secondary">Left rule in the tone colour.</p>
					{#snippet footer()}
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-text-muted">updated 2 days ago</span>
							<ui.Button variant="link" tone="violet">Open →</ui.Button>
						</div>
					{/snippet}
				</ui.Card>
			</section>
		</div>
	</div>
</ui.LocaleProvider>
