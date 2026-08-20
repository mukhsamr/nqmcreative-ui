<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Alert,
		Avatar,
		AvatarGroup,
		Badge,
		Breadcrumb,
		Button,
		Card,
		Checkbox,
		Divider,
		EmptyState,
		Field,
		Input,
		Kbd,
		Link,
		Modal,
		Pagination,
		Progress,
		Radio,
		Select,
		Skeleton,
		Spinner,
		Stat,
		Switch,
		Table,
		Tabs,
		Textarea,
		Tooltip,
		TONES,
		Combobox,
		Drawer,
		Dropdown,
		Dropzone,
		InputGroup,
		MenuItem,
		MenuSeparator,
		NumberInput,
		PasswordInput,
		Popover,
		RadioGroup,
		Slider,
		toast,
		CheckboxGroup,
		CommandPalette,
		ConfirmDialog,
		ContextMenu,
		LocaleProvider,
		SegmentedControl,
		ThemeToggle,
		DatePicker,
		MultiSelect,
		Calendar,
		idID,
		enUS
	} from '$lib/index.js';

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
	let quantity = $state(3);
	let opacity = $state(65);
	let delivery = $state('standard');
	let city = $state('');
	let search = $state('');
	let uploads = $state<File[]>([]);
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

<LocaleProvider locale={lang === 'id' ? idID : enUS}>
	<div class="min-h-screen bg-bg px-6 py-16 text-text">
		<div class="mx-auto flex max-w-4xl flex-col gap-16">
			<header class="flex flex-col gap-3">
				<div class="flex items-start justify-between gap-4">
					<Breadcrumb items={[{ label: 'Design system', href: '#' }, { label: 'Components' }]} />
					<div class="flex items-center gap-3">
						<SegmentedControl
							bind:value={lang}
							size="sm"
							tone="violet"
							label="Language"
							options={[
								{ value: 'en', label: 'EN' },
								{ value: 'id', label: 'ID' }
							]}
						/>
						<ThemeToggle variant="segmented" />
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
					<Button variant="solid">Solid</Button>
					<Button variant="soft">Soft</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link →</Button>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					{#each TONES as tone (tone)}
						<Button {tone} size="sm" variant="soft">{tone}</Button>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
					<Button size="xl">Extra large</Button>
					<Button loading>Saving</Button>
					<Button tone="danger" disabled>Disabled</Button>
				</div>
			</section>

			<!-- badges -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Badges</h2>
				<div class="flex flex-wrap items-center gap-3">
					{#each TONES as tone (tone)}
						<Badge {tone} dot>{tone}</Badge>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<Badge variant="solid" tone="brand">Solid</Badge>
					<Badge variant="outline" tone="accent">Outline</Badge>
					<Badge variant="soft" tone="violet" size="sm">Small</Badge>
				</div>
			</section>

			<!-- forms -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Forms</h2>
				<div class="grid gap-6 sm:grid-cols-2">
					<Field label="Full name" hint="Shown on the invoice." required for="name">
						<Input id="name" bind:value={name} placeholder="Nadia Q." />
					</Field>
					<Field label="Work email" error="That address is already registered." for="email">
						<Input id="email" invalid placeholder="you@studio.com" type="email" />
					</Field>
					<Field label="Plan" for="plan">
						<Select
							id="plan"
							bind:value={plan}
							options={[
								{ value: 'studio', label: 'Studio' },
								{ value: 'agency', label: 'Agency' },
								{ value: 'custom', label: 'Custom', disabled: true }
							]}
						/>
					</Field>
					<Field label="Budget" hint="Numbers only." for="budget">
						<Input id="budget" placeholder="50.000.000" tone="accent">
							{#snippet prefix()}
								<span class="font-mono text-xs">Rp</span>
							{/snippet}
						</Input>
					</Field>
				</div>

				<Field label="Project brief" hint="Markdown supported." for="brief">
					<Textarea id="brief" bind:value={brief} placeholder="Tell us about the project…" />
				</Field>

				<div class="flex flex-col gap-3">
					<Checkbox bind:checked={terms} label="I agree to the terms" description="Standard MSA." />
					<Checkbox indeterminate label="Partially selected" tone="violet" />
					<Checkbox label="Disabled option" disabled />
				</div>

				<Divider label="or" />

				<div class="flex flex-col gap-3">
					<Radio bind:group={billing} value="monthly" label="Monthly billing" />
					<Radio
						bind:group={billing}
						value="yearly"
						label="Yearly billing"
						description="Save 20%."
						tone="success"
					/>
				</div>

				<Switch
					bind:checked={notify}
					label="Email notifications"
					description="Weekly digest only."
					tone="info"
				/>
			</section>

			<!-- feedback -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Feedback</h2>
				<Alert tone="info" title="Heads up">Rendering takes about two minutes.</Alert>
				<Alert tone="success" variant="accent" title="Deployed">Live on production.</Alert>
				<Alert tone="warning" variant="outline" title="Quota at 85%" dismissible>
					Upgrade before the end of the cycle.
				</Alert>
				<Alert tone="danger" title="Payment failed">The card ending 4242 was declined.</Alert>

				<div class="grid gap-6 sm:grid-cols-2">
					<Progress value={72} label="Storage" showValue tone="brand" />
					<Progress value={38} label="Render queue" showValue tone="accent" size="lg" />
				</div>

				<div class="flex items-center gap-6">
					<Spinner size="sm" tone="brand" />
					<Spinner size="md" tone="accent" />
					<Spinner size="lg" tone="violet" />
				</div>

				<Card>
					<Skeleton variant="text" lines={3} />
				</Card>
			</section>

			<!-- data display -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Data display</h2>

				<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
					<div class="bg-bg p-6">
						<Stat label="Revenue" value="1,2M" delta="12.4%" trend="up" />
					</div>
					<div class="bg-bg p-6">
						<Stat label="Churn" value="2.1%" delta="0.4%" trend="down" tone="danger" />
					</div>
					<div class="bg-bg p-6">
						<Stat label="Active projects" value="18" hint="Across 9 clients" tone="brand" />
					</div>
				</div>

				<Table
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
							<Badge tone={statusTone[row.status as keyof typeof statusTone]} size="sm">
								{row.status}
							</Badge>
						{:else if column.key === 'budget'}
							{money.format(value as number)}
						{:else}
							{value}
						{/if}
					{/snippet}
				</Table>
				<p class="font-mono text-sm text-text-muted">
					selected: {picked.length ? picked.join(', ') : '(none)'} · sort: {sort
						? `${sort.key} ${sort.direction}`
						: '(none)'}
				</p>

				<div class="flex flex-wrap items-center gap-6">
					<AvatarGroup>
						<Avatar name="Nadia Q" tone="brand" />
						<Avatar name="Rafi A" tone="accent" />
						<Avatar name="Sita M" tone="violet" />
						<Avatar name="Dwi Pratama" tone="neutral" />
					</AvatarGroup>
					<Avatar name="Nadia Q" size="lg" squared tone="info" />
					<span class="font-sans text-sm text-text-secondary">
						Press <Kbd>⌘</Kbd>
						<Kbd>K</Kbd> to search
					</span>
				</div>

				<Pagination bind:page total={12} />
			</section>

			<!-- navigation -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Navigation</h2>

				<Tabs
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
					<Tabs
						variant="pill"
						tone="accent"
						items={[
							{ value: 'a', label: 'Pill' },
							{ value: 'b', label: 'Variant' }
						]}
					/>
					<Tabs
						variant="segmented"
						tone="violet"
						items={[
							{ value: 'a', label: 'Segmented' },
							{ value: 'b', label: 'Variant' }
						]}
					/>
				</div>

				<Accordion>
					<AccordionItem title="What does the retainer include?" meta="01" open>
						Strategy, design and two rounds of revision per sprint.
					</AccordionItem>
					<AccordionItem title="How fast is onboarding?" meta="02" tone="accent">
						Kick-off within five business days of the signed SOW.
					</AccordionItem>
					<AccordionItem title="Can we pause a sprint?" meta="03" tone="violet">
						Yes — with 14 days notice, once per quarter.
					</AccordionItem>
				</Accordion>
			</section>

			<!-- overlay & empty -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Overlay & empty states</h2>

				<div class="flex flex-wrap items-center gap-4">
					<Button onclick={() => (modalOpen = true)}>Open modal</Button>
					<Tooltip content="Flat, CSS-only tooltip">
						<Button variant="outline" tone="neutral">Hover me</Button>
					</Tooltip>
					<Link href="https://nqmcreative.com" external>nqmcreative.com</Link>
					<Link href="#" tone="accent" underline="always">Accent link</Link>
				</div>

				<EmptyState
					title="No projects yet"
					description="Create your first project to see it listed here."
					tone="brand"
				>
					{#snippet action()}
						<Button size="sm">New project</Button>
						<Button size="sm" variant="ghost" tone="neutral">Import</Button>
					{/snippet}
				</EmptyState>

				<Modal
					bind:open={modalOpen}
					title="Archive this project?"
					description="It stays readable but stops accepting new work."
				>
					Archiving moves <strong class="text-text">Sundara Rebrand</strong> out of the active list.
					You can restore it at any time.
					{#snippet footer()}
						<Button variant="ghost" tone="neutral" onclick={() => (modalOpen = false)}
							>Cancel</Button
						>
						<Button tone="danger" onclick={() => (modalOpen = false)}>Archive</Button>
					{/snippet}
				</Modal>
			</section>

			<!-- overlays -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Menus, popovers & drawers</h2>

				<div class="flex flex-wrap items-center gap-4">
					<Dropdown>
						{#snippet trigger()}
							<Button variant="outline" tone="neutral">Actions ▾</Button>
						{/snippet}
						<MenuSeparator label="This project" />
						<MenuItem shortcut="⌘E">Edit brief</MenuItem>
						<MenuItem shortcut="⌘D">Duplicate</MenuItem>
						<MenuItem selected>Notify the client</MenuItem>
						<MenuSeparator />
						<MenuItem tone="danger" shortcut="⌫">Delete project</MenuItem>
					</Dropdown>

					<Dropdown placement="bottom-end" matchWidth={false}>
						{#snippet trigger()}
							<Button variant="soft" tone="violet">Assign to ▾</Button>
						{/snippet}
						<MenuItem>Nadia Q.</MenuItem>
						<MenuItem>Rafi A.</MenuItem>
						<MenuItem disabled>Sita M. (away)</MenuItem>
					</Dropdown>

					<Popover title="Retainer scope">
						{#snippet trigger()}
							<Button variant="ghost" tone="info">What's included?</Button>
						{/snippet}
						Strategy, design and two rounds of revision per sprint. Extra rounds are billed at the hourly
						rate.
					</Popover>

					<Popover on="hover" placement="top" trapFocus={false}>
						{#snippet trigger()}
							<Button variant="ghost" tone="neutral">Hover card</Button>
						{/snippet}
						Opens on hover and on keyboard focus, and stays open while the pointer is inside it.
					</Popover>

					<Button onclick={() => (drawerOpen = true)}>Open drawer</Button>
				</div>

				<Drawer
					bind:open={drawerOpen}
					title="Project settings"
					description="Applies to this project only."
				>
					<div class="flex flex-col gap-6">
						<Field label="Visibility" for="vis">
							<Select
								id="vis"
								options={[
									{ value: 'team', label: 'Team only' },
									{ value: 'client', label: 'Team + client' },
									{ value: 'public', label: 'Public' }
								]}
							/>
						</Field>
						<Switch label="Weekly digest" description="Sent every Monday." tone="brand" />
						<Slider
							label="Render quality"
							showValue
							unit="%"
							bind:value={opacity}
							marks={[0, 100]}
						/>
					</div>
					{#snippet footer()}
						<Button variant="ghost" tone="neutral" onclick={() => (drawerOpen = false)}
							>Cancel</Button
						>
						<Button
							onclick={() => {
								drawerOpen = false;
								toast.success('Settings saved');
							}}>Save</Button
						>
					{/snippet}
				</Drawer>
			</section>

			<!-- toasts -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Toasts</h2>
				<div class="flex flex-wrap items-center gap-3">
					<Button
						size="sm"
						tone="success"
						variant="soft"
						onclick={() => toast.success('Project archived')}
					>
						Success
					</Button>
					<Button
						size="sm"
						tone="danger"
						variant="soft"
						onclick={() =>
							toast.error('Upload failed', { description: 'The file is over the 25 MB limit.' })}
					>
						Error
					</Button>
					<Button
						size="sm"
						tone="warning"
						variant="soft"
						onclick={() =>
							toast.warning('Storage at 85%', { action: { label: 'Upgrade', onclick: () => {} } })}
					>
						With action
					</Button>
					<Button
						size="sm"
						tone="brand"
						variant="soft"
						onclick={() => {
							const id = toast.loading('Rendering…');
							setTimeout(() => toast.update(id, 'Render complete', { tone: 'success' }), 2000);
						}}
					>
						Loading → done
					</Button>
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
					<Field label="Password" hint="Meter is length plus character variety." for="pw">
						<PasswordInput id="pw" bind:value={password} strength placeholder="••••••••" />
					</Field>

					<Field label="Quantity" for="qty">
						<NumberInput id="qty" bind:value={quantity} min={1} max={20} unit="pcs" />
					</Field>

					<Field label="City" hint="Type to filter, arrows to move." for="city">
						<Combobox id="city" bind:value={city} options={cities} placeholder="Search cities…" />
					</Field>

					<Field label="Search projects" for="q">
						<InputGroup>
							<Input id="q" bind:value={search} placeholder="Keyword" />
							<Button
								tone="brand"
								onclick={() => toast.info(`Searching “${search || 'everything'}”`)}
							>
								Search
							</Button>
						</InputGroup>
					</Field>
				</div>

				<Slider
					label="Opacity"
					bind:value={opacity}
					showValue
					unit="%"
					tone="accent"
					marks={[0, 50, 100]}
				/>

				<RadioGroup
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
				<Dropzone
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

			<!-- command, confirm, context menu -->
			<section class="flex flex-col gap-5">
				<h2 class="font-heading text-lg font-medium">Command, confirm & context menu</h2>

				<div class="flex flex-wrap items-center gap-4">
					<Button variant="outline" tone="neutral" onclick={() => (paletteOpen = true)}>
						Open palette <Kbd>⌘</Kbd><Kbd>K</Kbd>
					</Button>
					<Button tone="danger" variant="soft" onclick={() => (confirmOpen = true)}>
						Delete project…
					</Button>
				</div>

				<ContextMenu>
					{#snippet menu()}
						<MenuSeparator label="Row" />
						<MenuItem shortcut="⌘C">Copy</MenuItem>
						<MenuItem shortcut="⌘D">Duplicate</MenuItem>
						<MenuSeparator />
						<MenuItem tone="danger">Remove</MenuItem>
					{/snippet}
					<div
						class="flex h-28 items-center justify-center border border-dashed border-hairline-strong bg-bg-alt font-sans text-sm text-text-muted"
					>
						Right-click anywhere in this area
					</div>
				</ContextMenu>

				<CommandPalette
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

				<ConfirmDialog
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

				<SegmentedControl
					bind:value={view}
					label="View"
					options={[
						{ value: 'grid', label: 'Grid' },
						{ value: 'list', label: 'List' },
						{ value: 'board', label: 'Board' },
						{ value: 'gantt', label: 'Gantt', disabled: true }
					]}
				/>

				<CheckboxGroup
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
					<Field label="Deadline" hint="Type it, or pick from the calendar." for="deadline">
						<DatePicker id="deadline" bind:value={deadline} min="2026-01-01" />
					</Field>

					<Field label="Kick-off" hint="Weekends are blocked out." for="kickoff">
						<DatePicker
							id="kickoff"
							bind:value={kickoff}
							tone="accent"
							isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
						/>
					</Field>
				</div>

				<p class="font-mono text-sm text-text-muted">
					deadline: {deadline || '(empty)'} · kick-off: {kickoff || '(empty)'}
				</p>

				<Field label="Skills needed" hint="Up to four." for="skills">
					<MultiSelect
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
				</Field>

				<div class="flex flex-wrap items-start gap-6">
					<div class="border border-hairline">
						<Calendar bind:value={kickoff} tone="accent" />
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
					<Card eyebrow="Outline" title="Default" interactive>
						<p class="text-sm text-text-secondary">Hairline border on white.</p>
					</Card>
					<Card variant="filled" eyebrow="Filled" title="Alt surface">
						<p class="text-sm text-text-secondary">Sits on the alt surface.</p>
					</Card>
					<Card variant="tinted" tone="accent" eyebrow="Tinted" title="Accent">
						<p class="text-sm text-text-secondary">Uses the tone's light step.</p>
					</Card>
				</div>
				<Card accent tone="violet" title="With footer">
					<p class="text-sm text-text-secondary">Left rule in the tone colour.</p>
					{#snippet footer()}
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-text-muted">updated 2 days ago</span>
							<Button variant="link" tone="violet">Open →</Button>
						</div>
					{/snippet}
				</Card>
			</section>
		</div>
	</div>
</LocaleProvider>
