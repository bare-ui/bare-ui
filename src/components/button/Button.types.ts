/**
 * Button Component Types
 */

/**
 * Props for the Button component.
 *
 * When `asChild` is true, all props are merged onto the immediate child element
 * via React.cloneElement — useful for rendering as a router link, anchor, etc.
 *
 * When `asChild` is false (default), renders a native `<button>` element.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * When true, merges all props onto the immediate child element instead of
	 * rendering a `<button>`. The child must be a single React element.
	 *
	 * @example
	 * <Button asChild>
	 *   <a href="/about">About</a>
	 * </Button>
	 */
	asChild?: boolean;
}
