/**
 * Avatar Component Types
 */

export type AvatarImageStatus = 'loading' | 'loaded' | 'error';

export interface AvatarRootProps {
	class?: string;
}

export interface AvatarImageProps {
	src?: string;
	alt?: string;
	class?: string;
}

export interface AvatarFallbackProps {
	/**
	 * Delay in milliseconds before the fallback becomes visible.
	 * @default 0
	 */
	delayMs?: number;
	class?: string;
}
