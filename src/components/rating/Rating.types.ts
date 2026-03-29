/**
 * Rating Component Types
 */

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled rating value (1–max) */
	value?: number
	/** Initial uncontrolled value */
	defaultValue?: number
	/** Callback fired when a star is selected */
	onChange?: (value: number) => void
	/** Number of stars to render (default: 5) */
	max?: number
	/** Disables all interaction */
	disabled?: boolean
	/** Read-only display — no interaction, no hover preview */
	readOnly?: boolean
	/** className applied to each individual star button */
	starClassName?: string
}
