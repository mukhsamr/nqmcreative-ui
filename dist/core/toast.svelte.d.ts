/**
 * Toast queue. One module-level store, so any file can fire a toast without
 * prop-drilling — mount a single `<Toaster />` once, near the root.
 *
 *   import { toast } from '@nqmcreative/ui';
 *   toast.success('Project archived');
 *   toast.error('Upload failed', { description: 'The file is over 25 MB.' });
 *   const id = toast.loading('Rendering…');
 *   toast.dismiss(id);
 */
import type { Tone } from './tones.js';
export interface ToastAction {
    label: string;
    onclick: () => void;
}
export interface ToastOptions {
    description?: string;
    tone?: Tone;
    /** Milliseconds on screen. `0` keeps it until dismissed. Default 5000. */
    duration?: number;
    action?: ToastAction;
    /** Swaps the glyph for a spinner and defaults `duration` to 0. */
    loading?: boolean;
}
export interface Toast extends ToastOptions {
    id: number;
    title: string;
    tone: Tone;
    duration: number;
}
declare class ToastStore {
    items: Toast[];
    private timers;
    /** Fires a toast and returns its id, for `update` or `dismiss`. */
    show(title: string, options?: ToastOptions): number;
    /** Replaces a live toast in place — a loading toast becoming a result. */
    update(id: number, title: string, options?: ToastOptions): void;
    dismiss(id: number): void;
    clear(): void;
    success: (title: string, options?: ToastOptions) => number;
    error: (title: string, options?: ToastOptions) => number;
    warning: (title: string, options?: ToastOptions) => number;
    info: (title: string, options?: ToastOptions) => number;
    loading: (title: string, options?: ToastOptions) => number;
}
export declare const toast: ToastStore;
export {};
