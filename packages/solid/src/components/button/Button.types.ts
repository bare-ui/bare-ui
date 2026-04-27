import type { JSX } from 'solid-js';

/**
 * Button Component Types
 */

/**
 * Props for the Button component.
 *
 * When `asChild` is true, the component renders the child element as-is and
 * applies its data-attributes / event listeners imperatively — useful for
 * rendering as a router link, anchor, etc. The child must be a single element.
 *
 * When `asChild` is false (default), renders a native `<button>` element.
 */
export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * When true, renders the child element directly instead of a `<button>`,
	 * applying data-state attributes and interactive-state event listeners to
	 * that element. The child must be a single element.
	 *
	 * @example
	 * <Button asChild>
	 *   <a href="/about">About</a>
	 * </Button>
	 */
	asChild?: boolean;
}
