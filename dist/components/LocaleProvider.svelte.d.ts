import type { Snippet } from 'svelte';
import { type Locale } from '../locale.svelte.js';
interface Props {
    /** Full locale or just the keys you want to change. */
    locale: Partial<Locale>;
    children: Snippet;
}
declare const LocaleProvider: import("svelte").Component<Props, {}, "">;
type LocaleProvider = ReturnType<typeof LocaleProvider>;
export default LocaleProvider;
