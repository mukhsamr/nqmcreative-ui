/**
 * Every string a component renders on its own — labels, ARIA names, the words
 * inside a rejected-file message. Override them once instead of passing a prop
 * to every instance.
 *
 * Two ways in:
 *
 *   1. `setLocale(idID)` at app start — one global locale, the common case.
 *   2. `<LocaleProvider locale={idID}>` — scoped to a subtree, and the right
 *      choice under SSR, where module state is shared between requests.
 *
 * Per-instance props still win over both: `<Table empty="…" />`.
 */

import { getContext, setContext } from 'svelte';

export interface Locale {
	/* shared */
	close: string;
	dismiss: string;
	loading: string;
	cancel: string;
	confirm: string;
	clear: string;
	search: string;

	/* menus & overlays */
	menu: string;
	navigation: string;
	openMenu: string;
	closeMenu: string;
	collapseSidebar: string;
	expandSidebar: string;
	notifications: string;
	commandPlaceholder: string;
	noResults: string;

	/* table */
	noData: string;
	selectAllRows: string;
	selectRow: string;

	/* pagination */
	pagination: string;
	previousPage: string;
	nextPage: string;

	/* breadcrumb */
	breadcrumb: string;

	/* combobox */
	comboboxPlaceholder: string;
	noMatches: string;

	/* dropzone */
	dropFiles: string;
	or: string;
	browse: string;
	remove: string;
	rejectedType: string;
	rejectedSize: string;
	rejectedCount: string;
	/** Byte-size units, smallest first. */
	byteUnits: [string, string, string, string];

	/* password */
	showPassword: string;
	hidePassword: string;
	/** Five buckets, from empty to strongest. */
	passwordStrength: [string, string, string, string, string];

	/* number input */
	decrease: string;
	increase: string;

	/* date picker */
	/** BCP 47 tag handed to `Intl` for month and weekday names. */
	dateLocale: string;
	/** Order of the date parts the input accepts and prints. */
	dateFormat: 'dmy' | 'mdy' | 'ymd';
	today: string;
	previousMonth: string;
	nextMonth: string;
	selectDate: string;

	/* multi select */
	selected: string;
	removeItem: string;

	/* theme toggle */
	toggleTheme: string;
	lightMode: string;
	darkMode: string;
}

export const enUS: Locale = {
	close: 'Close',
	dismiss: 'Dismiss',
	loading: 'Loading',
	cancel: 'Cancel',
	confirm: 'Confirm',
	clear: 'Clear selection',
	search: 'Search',

	menu: 'Menu',
	navigation: 'Navigation',
	openMenu: 'Open menu',
	closeMenu: 'Close menu',
	collapseSidebar: 'Collapse sidebar',
	expandSidebar: 'Expand sidebar',
	notifications: 'Notifications',
	commandPlaceholder: 'Type a command or search…',
	noResults: 'No results',

	noData: 'No data',
	selectAllRows: 'Select all rows',
	selectRow: 'Select row',

	pagination: 'Pagination',
	previousPage: 'Previous page',
	nextPage: 'Next page',

	breadcrumb: 'Breadcrumb',

	comboboxPlaceholder: 'Search…',
	noMatches: 'No matches',

	dropFiles: 'Drop files here',
	or: 'or',
	browse: 'browse',
	remove: 'Remove',
	rejectedType: 'wrong file type',
	rejectedSize: 'too large',
	rejectedCount: 'over the file limit',
	byteUnits: ['B', 'KB', 'MB', 'GB'],

	showPassword: 'Show password',
	hidePassword: 'Hide password',
	passwordStrength: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'],

	decrease: 'Decrease',
	increase: 'Increase',

	dateLocale: 'en-US',
	dateFormat: 'mdy',
	today: 'Today',
	previousMonth: 'Previous month',
	nextMonth: 'Next month',
	selectDate: 'Select a date',

	selected: 'selected',
	removeItem: 'Remove',

	toggleTheme: 'Toggle theme',
	lightMode: 'Light',
	darkMode: 'Dark'
};

/** Bahasa Indonesia. Pass to `setLocale` or `<LocaleProvider>`. */
export const idID: Locale = {
	close: 'Tutup',
	dismiss: 'Tutup',
	loading: 'Memuat',
	cancel: 'Batal',
	confirm: 'Konfirmasi',
	clear: 'Hapus pilihan',
	search: 'Cari',

	menu: 'Menu',
	navigation: 'Navigasi',
	openMenu: 'Buka menu',
	closeMenu: 'Tutup menu',
	collapseSidebar: 'Ciutkan bilah sisi',
	expandSidebar: 'Bentangkan bilah sisi',
	notifications: 'Notifikasi',
	commandPlaceholder: 'Ketik perintah atau cari…',
	noResults: 'Tidak ada hasil',

	noData: 'Tidak ada data',
	selectAllRows: 'Pilih semua baris',
	selectRow: 'Pilih baris',

	pagination: 'Paginasi',
	previousPage: 'Halaman sebelumnya',
	nextPage: 'Halaman berikutnya',

	breadcrumb: 'Remah roti',

	comboboxPlaceholder: 'Cari…',
	noMatches: 'Tidak ditemukan',

	dropFiles: 'Letakkan berkas di sini',
	or: 'atau',
	browse: 'jelajahi',
	remove: 'Hapus',
	rejectedType: 'tipe berkas tidak sesuai',
	rejectedSize: 'ukuran terlalu besar',
	rejectedCount: 'melebihi batas jumlah berkas',
	byteUnits: ['B', 'KB', 'MB', 'GB'],

	showPassword: 'Tampilkan kata sandi',
	hidePassword: 'Sembunyikan kata sandi',
	passwordStrength: ['Terlalu pendek', 'Lemah', 'Cukup', 'Baik', 'Kuat'],

	decrease: 'Kurangi',
	increase: 'Tambah',

	dateLocale: 'id-ID',
	dateFormat: 'dmy',
	today: 'Hari ini',
	previousMonth: 'Bulan sebelumnya',
	nextMonth: 'Bulan berikutnya',
	selectDate: 'Pilih tanggal',

	selected: 'dipilih',
	removeItem: 'Hapus',

	toggleTheme: 'Ganti tema',
	lightMode: 'Terang',
	darkMode: 'Gelap'
};

export class LocaleStore {
	current = $state<Locale>({ ...enUS });

	/** Merges on top of what is already there. */
	set(next: Partial<Locale>) {
		this.current = { ...this.current, ...next };
	}

	/**
	 * Replaces everything with `enUS` plus `next`. Unlike `set` this never reads
	 * `current`, so it is safe to call from an effect without the write feeding
	 * back into the effect's own dependencies.
	 */
	replace(next: Partial<Locale>) {
		this.current = { ...enUS, ...next };
	}
}

const KEY = Symbol.for('@nqmcreative/ui:locale');

/** The global locale, used by any component with no provider above it. */
export const locale = new LocaleStore();

/** Replaces some or all of the global strings. Call once, at app start. */
export function setLocale(next: Partial<Locale>) {
	locale.set(next);
}

/**
 * Scopes a locale to the current component subtree. Call during init — the
 * `LocaleProvider` component does exactly this.
 */
export function provideLocale(next: Partial<Locale>): LocaleStore {
	const store = new LocaleStore();
	store.replace(next);
	setContext(KEY, store);
	return store;
}

/** The nearest provided locale, falling back to the global one. */
export function useLocale(): LocaleStore {
	return getContext<LocaleStore | undefined>(KEY) ?? locale;
}
