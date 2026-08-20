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

let nextId = 0;

class ToastStore {
	items = $state<Toast[]>([]);
	private timers = new Map<number, ReturnType<typeof setTimeout>>();

	/** Fires a toast and returns its id, for `update` or `dismiss`. */
	show(title: string, options: ToastOptions = {}): number {
		const id = nextId++;
		const duration = options.duration ?? (options.loading ? 0 : 5000);
		const toast: Toast = { ...options, id, title, tone: options.tone ?? 'neutral', duration };

		this.items = [...this.items, toast];
		if (duration > 0)
			this.timers.set(
				id,
				setTimeout(() => this.dismiss(id), duration)
			);
		return id;
	}

	/** Replaces a live toast in place — a loading toast becoming a result. */
	update(id: number, title: string, options: ToastOptions = {}) {
		const existing = this.items.find((t) => t.id === id);
		if (!existing) return;

		clearTimeout(this.timers.get(id));
		const duration = options.duration ?? (options.loading ? 0 : 5000);
		const next: Toast = {
			...existing,
			...options,
			loading: options.loading ?? false,
			title,
			tone: options.tone ?? existing.tone,
			duration
		};

		this.items = this.items.map((t) => (t.id === id ? next : t));
		if (duration > 0)
			this.timers.set(
				id,
				setTimeout(() => this.dismiss(id), duration)
			);
	}

	dismiss(id: number) {
		clearTimeout(this.timers.get(id));
		this.timers.delete(id);
		this.items = this.items.filter((t) => t.id !== id);
	}

	clear() {
		this.timers.forEach(clearTimeout);
		this.timers.clear();
		this.items = [];
	}

	success = (title: string, options?: ToastOptions) =>
		this.show(title, { ...options, tone: 'success' });

	error = (title: string, options?: ToastOptions) =>
		this.show(title, { ...options, tone: 'danger', duration: options?.duration ?? 8000 });

	warning = (title: string, options?: ToastOptions) =>
		this.show(title, { ...options, tone: 'warning' });

	info = (title: string, options?: ToastOptions) => this.show(title, { ...options, tone: 'info' });

	loading = (title: string, options?: ToastOptions) =>
		this.show(title, { ...options, tone: 'brand', loading: true });
}

export const toast = new ToastStore();
