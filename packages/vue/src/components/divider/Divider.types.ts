/**
 * Divider Component Types
 */

export interface DividerProps {
	/**
	 * Visual orientation of the divider line.
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical';
	/**
	 * When true, the divider is purely presentational and hidden from assistive technology.
	 * @default true
	 */
	decorative?: boolean;
}
