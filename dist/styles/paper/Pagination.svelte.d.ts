import type { HTMLAttributes } from 'svelte/elements';
import { type Tone } from '../../core/tones.js';
interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
    /** Bindable, 1-based. */
    page?: number;
    /** Total number of pages. */
    total: number;
    /** Pages shown either side of the current one before collapsing to `…`. */
    siblings?: number;
    tone?: Tone;
    onchange?: (page: number) => void;
}
declare const Pagination: import("svelte").Component<Props, {}, "page">;
type Pagination = ReturnType<typeof Pagination>;
export default Pagination;
