export type ToasterPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
interface Props {
    position?: ToasterPosition;
    class?: string;
}
declare const Toaster: import("svelte").Component<Props, {}, "">;
type Toaster = ReturnType<typeof Toaster>;
export default Toaster;
