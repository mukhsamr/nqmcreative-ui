export type Theme = 'light' | 'dark' | 'system';
/** Writes the theme classes `theme.css` reads. Safe to call before mount. */
export declare function applyTheme(theme: Theme): void;
/** The stored choice, or `'system'` when the visitor has never picked one. */
export declare function storedTheme(): Theme;
import { type Tone } from '../tones.js';
interface Props {
    /** Bindable. `'system'` follows the OS until the visitor chooses. */
    theme?: Theme;
    /** `'button'` cycles light → dark → system; `'segmented'` shows all three. */
    variant?: 'button' | 'segmented';
    tone?: Tone;
    /** Remember the choice in `localStorage`. Default true. */
    persist?: boolean;
    onchange?: (theme: Theme) => void;
    class?: string;
}
declare const ThemeToggle: import("svelte").Component<Props, {}, "theme">;
type ThemeToggle = ReturnType<typeof ThemeToggle>;
export default ThemeToggle;
