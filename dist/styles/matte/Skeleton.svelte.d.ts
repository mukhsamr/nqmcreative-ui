import type { HTMLAttributes } from 'svelte/elements';
export type SkeletonVariant = 'text' | 'block' | 'circle';
interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: SkeletonVariant;
    /** `text` only — number of stacked lines, the last one runs short. */
    lines?: number;
    /** Any CSS length, e.g. `'12rem'` or `'60%'`. */
    width?: string;
    height?: string;
}
declare const Skeleton: import("svelte").Component<Props, {}, "">;
type Skeleton = ReturnType<typeof Skeleton>;
export default Skeleton;
