import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AvatarFallbackProps, AvatarImageProps, AvatarImageStatus, AvatarRootProps } from './Avatar.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AvatarContextValue {
	imageStatus: AvatarImageStatus;
	setImageStatus: (status: AvatarImageStatus) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext(): AvatarContextValue {
	const ctx = useContext(AvatarContext);
	if (!ctx) {
		throw new globalThis.Error('[wire-ui] Avatar sub-components must be used inside <Avatar.Root>');
	}
	return ctx;
}

// ---------------------------------------------------------------------------
// Avatar.Root
// ---------------------------------------------------------------------------

/**
 * The container for the Avatar. Exposes `data-status` reflecting the current
 * image load state: `"loading"`, `"loaded"`, or `"error"`.
 *
 * @example
 * <Avatar.Root className="...">
 *   <Avatar.Image src="..." alt="Jane Doe" />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.Root>
 */
const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(({ children, ...rest }, ref) => {
	const [imageStatus, setImageStatus] = useState<AvatarImageStatus>('loading');

	return (
		<AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
			<div
				ref={ref}
				data-status={imageStatus}
				{...rest}>
				{children}
			</div>
		</AvatarContext.Provider>
	);
});

AvatarRoot.displayName = 'Avatar.Root';

// ---------------------------------------------------------------------------
// Avatar.Image
// ---------------------------------------------------------------------------

/**
 * The avatar image. Automatically reports its load state back to `Avatar.Root`
 * via context — the Root's `data-status` updates to `"loaded"` or `"error"`.
 *
 * Hidden (not rendered) when `src` is empty/undefined so the Fallback shows
 * immediately without a broken-image icon.
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
	({ src, onLoad, onError, style, ...rest }, ref) => {
		const { imageStatus, setImageStatus } = useAvatarContext();

		useEffect(() => {
			if (!src) {
				setImageStatus('error');
			} else {
				setImageStatus('loading');
			}
		}, [src, setImageStatus]);

		if (!src) return null;

		return (
			<img
				ref={ref}
				src={src}
				data-status={imageStatus}
				style={{ display: imageStatus === 'loaded' ? undefined : 'none', ...style }}
				onLoad={(e) => {
					setImageStatus('loaded');
					onLoad?.(e);
				}}
				onError={(e) => {
					setImageStatus('error');
					onError?.(e);
				}}
				{...rest}
			/>
		);
	},
);

AvatarImage.displayName = 'Avatar.Image';

// ---------------------------------------------------------------------------
// Avatar.Fallback
// ---------------------------------------------------------------------------

/**
 * Rendered when the image is still loading or has failed.
 * Supply `delayMs` to avoid a flash of the fallback during fast loads.
 *
 * @example
 * // Initials fallback
 * <Avatar.Fallback>JD</Avatar.Fallback>
 *
 * // Overflow count fallback
 * <Avatar.Fallback>+5</Avatar.Fallback>
 *
 * // Delayed — only shows if image takes > 300ms
 * <Avatar.Fallback delayMs={300}>JD</Avatar.Fallback>
 */
const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
	({ delayMs = 0, children, ...rest }, ref) => {
		const { imageStatus } = useAvatarContext();
		const [canRender, setCanRender] = useState(delayMs === 0);

		useEffect(() => {
			if (delayMs > 0) {
				const timer = setTimeout(() => setCanRender(true), delayMs);
				return () => clearTimeout(timer);
			}
		}, [delayMs]);

		if (imageStatus === 'loaded') return null;
		if (!canRender) return null;

		return (
			<span
				ref={ref}
				{...rest}>
				{children}
			</span>
		);
	},
);

AvatarFallback.displayName = 'Avatar.Fallback';

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Avatar = Object.assign(AvatarRoot, {
	Root: AvatarRoot,
	Image: AvatarImage,
	Fallback: AvatarFallback,
});
