import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
export type FeatureColumns = 2 | 3 | 4;
interface Props extends HTMLAttributes<HTMLElement> {
    eyebrow?: string;
    title?: string;
    description?: string;
    columns?: FeatureColumns;
    /** Cards in a bordered grid rather than free-standing. */
    bordered?: boolean;
    /** `FeatureCard`s, or anything else. */
    children: Snippet;
}
declare const FeatureGrid: import("svelte").Component<Props, {}, "">;
type FeatureGrid = ReturnType<typeof FeatureGrid>;
export default FeatureGrid;
