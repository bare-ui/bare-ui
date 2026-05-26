import type { JSX } from 'solid-js';

export type VirtualizerOrientation = 'vertical' | 'horizontal';

export interface VirtualItem {
	index: number;
	/** Offset from the start of the list along the scroll axis, in px. */
	start: number;
	/** Measured (or estimated) size along the scroll axis, in px. */
	size: number;
}

export interface VirtualizerRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Total number of items. */
	count: number;
	/** Estimated item size (px) before measurement. Default `50`. */
	estimateSize?: number;
	/** Extra items rendered beyond the viewport on each side. Default `4`. */
	overscan?: number;
	/** Scroll axis. Default `'vertical'`. */
	orientation?: VirtualizerOrientation;
	/** Stable key per index (helps when the list reorders). Defaults to the index. */
	getItemKey?: (index: number) => string | number;
	/** Render a single item. */
	children: (item: VirtualItem) => JSX.Element;
}
