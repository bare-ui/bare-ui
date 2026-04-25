import type { JSX } from 'solid-js';

/**
 * Card Component Types
 *
 * Type definitions for the Card component including props
 * and related types.
 */

/**
 * Props interface for Card component
 */
export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Color modifier for the card */
	color?: string;
	/** Size modifier that controls padding around the card */
	size?: string;
	/** Card content */
	children?: JSX.Element;
}
