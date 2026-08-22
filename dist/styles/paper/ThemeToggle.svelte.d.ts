import { type Tone } from '../../core/tones.js';
import { type Theme } from '../../core/theme.svelte.js';
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
