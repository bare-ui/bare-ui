/**
 * List Component Types
 */

export interface ListProps {
	/** Whether to render as ordered list (ol) or unordered list (ul). */
	isOrdered?: boolean;
	/** Visual style type of the list. */
	type?: string;
	/** Size of the list items. */
	size?: string;
}
