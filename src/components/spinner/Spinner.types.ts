/**
 * Spinner Component Types
 *
 * Type definitions for the Spinner component including props
 * and related types.
 */

/**
 * Props interface for Spinner component
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The size of the spinner */
	size?: string
	/** Custom color for the spinner dots (applied as a CSS variable) */
	color?: string
}
