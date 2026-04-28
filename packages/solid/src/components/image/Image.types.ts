import type { JSX } from 'solid-js';

/**
 * Image Component Types
 *
 * Type definitions for the Image component including props
 * and related types.
 */

/**
 * Props interface for Image component
 */
export interface ImageProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Source path of the image */
	src: string;
	/** Alt text for the image */
	alt?: string;
	/** Horizontal alignment of the image */
	position?: string;
	/** Callback fired when the image has loaded or errored */
	onImageLoaded?: () => void;
}
