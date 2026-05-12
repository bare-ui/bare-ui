import type { JSX } from 'solid-js';

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Accessible label announced to screen readers. Defaults to "Loading". */
	label?: string;
	/** Hides the visual element from screen readers (the label is still announced). Defaults to true. */
	decorative?: boolean;
}
