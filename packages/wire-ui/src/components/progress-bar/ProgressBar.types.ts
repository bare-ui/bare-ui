/**
 * ProgressBar Component Types
 *
 * Type definitions for the ProgressBar component including props
 * and related types.
 */

/**
 * Props interface for ProgressBar component
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The progress percentage value (0-100) */
	percentage?: number;
	/** The size of the progress bar */
	size?: string;
}
