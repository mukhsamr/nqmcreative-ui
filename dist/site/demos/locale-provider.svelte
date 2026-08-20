<script lang="ts">
	import LocaleProvider from '../../components/LocaleProvider.svelte';
	import Pagination from '../../components/Pagination.svelte';
	import SegmentedControl from '../../components/SegmentedControl.svelte';
	import { enUS, idID } from '../../locale.svelte.js';

	let lang = $state('id');
	let page = $state(3);
</script>

<div class="flex w-full flex-col gap-5">
	<SegmentedControl
		bind:value={lang}
		size="sm"
		label="Language"
		options={[
			{ value: 'en', label: 'EN' },
			{ value: 'id', label: 'ID' }
		]}
	/>
	<LocaleProvider locale={lang === 'id' ? idID : enUS}>
		<Pagination bind:page total={12} />
	</LocaleProvider>
	<p class="font-mono text-xs text-text-muted">hover the arrows — their labels follow the locale</p>
</div>
