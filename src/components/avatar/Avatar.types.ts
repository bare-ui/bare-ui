/**
 * Avatar Component Types
 */

/**
 * Image load status shared via context between Avatar sub-components.
 */
export type AvatarImageStatus = 'loading' | 'loaded' | 'error'

/**
 * Props for Avatar.Root — the wrapping container element.
 * Exposes `data-status` reflecting the current image load state.
 */
export type AvatarRootProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Props for Avatar.Image — the actual `<img>` element.
 * Automatically tracks load/error state and updates the Root's `data-status`.
 */
export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>

/**
 * Props for Avatar.Fallback — rendered when the image is loading or failed.
 */
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Delay in milliseconds before the fallback becomes visible.
	 * Useful to avoid a flash of the fallback during fast image loads.
	 * @default 0
	 */
	delayMs?: number
}
