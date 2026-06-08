'use client';

import { createContext, createEffect, createSignal, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createTimeout } from '@/primitives/create-timeout';
import type { AvatarFallbackProps, AvatarImageProps, AvatarImageStatus, AvatarRootProps } from './Avatar.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AvatarContextValue {
	readonly imageStatus: AvatarImageStatus;
	setImageStatus: (status: AvatarImageStatus) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext(): AvatarContextValue {
	const ctx = useContext(AvatarContext);
	if (!ctx) {
		throw new Error('[wire-ui] Avatar sub-components must be used inside <Avatar.Root>');
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
 * <Avatar.Root class="...">
 *   <Avatar.Image src="..." alt="Jane Doe" />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.Root>
 */
function Root(props: AvatarRootProps) {
	const [local, rest] = splitProps(props, ['children']);
	const [imageStatus, setImageStatus] = createSignal<AvatarImageStatus>('loading');

	const ctxValue: AvatarContextValue = {
		get imageStatus() {
			return imageStatus();
		},
		setImageStatus,
	};

	return (
		<AvatarContext.Provider value={ctxValue}>
			<div
				data-status={imageStatus()}
				{...rest}>
				{local.children}
			</div>
		</AvatarContext.Provider>
	);
}

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
function AvatarImage(props: AvatarImageProps) {
	const [local, rest] = splitProps(props, ['src', 'onLoad', 'onError', 'style']);
	const ctx = useAvatarContext();

	createEffect(() => {
		if (!local.src) {
			ctx.setImageStatus('error');
		} else {
			ctx.setImageStatus('loading');
		}
	});

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ourStyle: JSX.CSSProperties = ctx.imageStatus === 'loaded' ? {} : { display: 'none' };
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return ourStyle;
		return { ...ourStyle, ...(userStyle as JSX.CSSProperties) };
	};

	const handleLoad: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
		ctx.setImageStatus('loaded');
		const userOnLoad = local.onLoad;
		if (typeof userOnLoad === 'function') (userOnLoad as (event: typeof e) => void)(e);
	};

	const handleError: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
		ctx.setImageStatus('error');
		const userOnError = local.onError;
		if (typeof userOnError === 'function') (userOnError as (event: typeof e) => void)(e);
	};

	return (
		<Show when={local.src}>
			<img
				src={local.src}
				data-status={ctx.imageStatus}
				style={mergedStyle()}
				onLoad={handleLoad}
				onError={handleError}
				{...rest}
			/>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Avatar.Fallback
// ---------------------------------------------------------------------------

/**
 * Rendered when the image is still loading or has failed.
 * Supply `delayMs` to avoid a flash of the fallback during fast loads.
 *
 * @example
 * <Avatar.Fallback delayMs={300}>JD</Avatar.Fallback>
 */
function Fallback(props: AvatarFallbackProps) {
	const [local, rest] = splitProps(props, ['delayMs', 'children']);
	const ctx = useAvatarContext();
	const delayMs = () => local.delayMs ?? 0;
	const [canRender, setCanRender] = createSignal(delayMs() === 0);

	const { start } = createTimeout(() => setCanRender(true), delayMs, { autoStart: false });
	createEffect(() => {
		if (delayMs() > 0) start();
	});

	return (
		<Show when={ctx.imageStatus !== 'loaded' && canRender()}>
			<span {...rest}>{local.children}</span>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Compound export — Avatar is callable as Root and exposes sub-components
// ---------------------------------------------------------------------------

export const Avatar = Object.assign(Root, {
	Root,
	Image: AvatarImage,
	Fallback,
});

// Named exports expose the sub-components to Storybook's docgen (public API stays `Avatar.*`).
export { Root, AvatarImage, Fallback };