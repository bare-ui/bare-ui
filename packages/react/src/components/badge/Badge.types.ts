/**
 * Badge Component Types
 *
 * Type definitions for the Badge component including props
 * and related types.
 */

/**
 * Props interface for Badge component
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** Count of notifications. Displays "9+" when count exceeds 9. */
	count?: number;
}
