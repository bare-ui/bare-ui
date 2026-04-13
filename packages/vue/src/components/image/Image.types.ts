/**
 * Image Component Types
 */

export interface ImageProps {
	/** Source path of the image */
	src: string;
	/** Alt text for the image */
	alt?: string;
	/** Horizontal alignment of the image */
	position?: string;
	/** Callback fired when the image has loaded or errored */
	onImageLoaded?: () => void;
}
