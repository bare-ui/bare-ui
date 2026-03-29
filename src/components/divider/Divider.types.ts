/**
 * Divider Component Types
 */

/**
 * Props for the Divider component.
 *
 * When `decorative` is true (default), the element is purely visual — it
 * carries `role="none"` and `aria-hidden="true"` so screen readers skip it.
 *
 * When `decorative` is false, it becomes a semantic separator with
 * `role="separator"` and `aria-orientation` set, which screen readers announce.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Visual orientation of the divider line.
	 * Exposed as `data-orientation="horizontal|vertical"` for CSS targeting.
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical';
	/**
	 * When true, the divider is purely presentational and hidden from
	 * assistive technology. When false, it is announced as a separator.
	 * @default true
	 */
	decorative?: boolean;
}
