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
export interface Locale {
    close: string;
    dismiss: string;
    loading: string;
    cancel: string;
    confirm: string;
    clear: string;
    search: string;
    menu: string;
    navigation: string;
    openMenu: string;
    closeMenu: string;
    collapseSidebar: string;
    expandSidebar: string;
    notifications: string;
    commandPlaceholder: string;
    noResults: string;
    noData: string;
    selectAllRows: string;
    selectRow: string;
    pagination: string;
    previousPage: string;
    nextPage: string;
    breadcrumb: string;
    comboboxPlaceholder: string;
    noMatches: string;
    dropFiles: string;
    or: string;
    browse: string;
    remove: string;
    rejectedType: string;
    rejectedSize: string;
    rejectedCount: string;
    /** Byte-size units, smallest first. */
    byteUnits: [string, string, string, string];
    showPassword: string;
    hidePassword: string;
    /** Five buckets, from empty to strongest. */
    passwordStrength: [string, string, string, string, string];
    decrease: string;
    increase: string;
    /** BCP 47 tag handed to `Intl` for month and weekday names. */
    dateLocale: string;
    /** Order of the date parts the input accepts and prints. */
    dateFormat: 'dmy' | 'mdy' | 'ymd';
    today: string;
    previousMonth: string;
    nextMonth: string;
    selectDate: string;
    selected: string;
    removeItem: string;
    toggleTheme: string;
    lightMode: string;
    darkMode: string;
}
export declare const enUS: Locale;
/** Bahasa Indonesia. Pass to `setLocale` or `<LocaleProvider>`. */
export declare const idID: Locale;
export declare class LocaleStore {
    current: Locale;
    /** Merges on top of what is already there. */
    set(next: Partial<Locale>): void;
    /**
     * Replaces everything with `enUS` plus `next`. Unlike `set` this never reads
     * `current`, so it is safe to call from an effect without the write feeding
     * back into the effect's own dependencies.
     */
    replace(next: Partial<Locale>): void;
}
/** The global locale, used by any component with no provider above it. */
export declare const locale: LocaleStore;
/** Replaces some or all of the global strings. Call once, at app start. */
export declare function setLocale(next: Partial<Locale>): void;
/**
 * Scopes a locale to the current component subtree. Call during init — the
 * `LocaleProvider` component does exactly this.
 */
export declare function provideLocale(next: Partial<Locale>): LocaleStore;
/** The nearest provided locale, falling back to the global one. */
export declare function useLocale(): LocaleStore;
