/**
 * Button Component Types
 */

export interface ButtonProps {
	/**
	 * When true, merges all props onto the immediate child element instead of
	 * rendering a `<button>`. The child must be a single element in the default slot.
	 */
	asChild?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;
	type?: 'button' | 'submit' | 'reset';
}
