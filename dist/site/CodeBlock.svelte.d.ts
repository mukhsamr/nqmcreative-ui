interface Props {
    code: string;
    /** Shown in the header strip. */
    label?: string;
    class?: string;
}
declare const CodeBlock: import("svelte").Component<Props, {}, "">;
type CodeBlock = ReturnType<typeof CodeBlock>;
export default CodeBlock;
