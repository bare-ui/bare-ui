import type { JSX } from 'solid-js';

export interface ListProps extends JSX.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
	/** Whether to render as ordered list (ol) or unordered list (ul). */
	isOrdered?: boolean;
	/** Visual style type of the list. */
	type?: string;
	/** Size of the list items. */
	size?: string;
}
