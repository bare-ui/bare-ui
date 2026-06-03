'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { clamp, hexToHsva, hsvaToHex, hsvaToRgba, hsvToRgb } from './color-utils';
import type {
	ColorPickerAlphaProps,
	ColorPickerAlphaThumbProps,
	ColorPickerAreaProps,
	ColorPickerAreaThumbProps,
	ColorPickerContextValue,
	ColorPickerHueProps,
	ColorPickerHueThumbProps,
	ColorPickerInputProps,
	ColorPickerRootProps,
	ColorPickerSwatchProps,
	HSVA,
} from './ColorPicker.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

function useColorPickerContext() {
	const ctx = useContext(ColorPickerContext);
	if (!ctx) throw new globalThis.Error('ColorPicker sub-components must be used within ColorPicker.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Pointer-drag helper
// ---------------------------------------------------------------------------

function useTrackDrag<T extends HTMLElement>(onMove: (xRatio: number, yRatio: number) => void) {
	const ref = useRef<T | null>(null);
	const dragging = useRef(false);
	const onMoveRef = useRef(onMove);
	useEffect(() => {
		onMoveRef.current = onMove;
	});

	const compute = useCallback((clientX: number, clientY: number) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
		const y = clamp((clientY - rect.top) / (rect.height || 1), 0, 1);
		onMoveRef.current(x, y);
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<T>) => {
			dragging.current = true;
			(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
			compute(e.clientX, e.clientY);
		},
		[compute],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<T>) => {
			if (dragging.current) compute(e.clientX, e.clientY);
		},
		[compute],
	);

	const onPointerUp = useCallback((e: React.PointerEvent<T>) => {
		dragging.current = false;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	}, []);

	return { ref, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const DEFAULT: HSVA = { h: 0, s: 0, v: 0, a: 1 };

const Root = React.forwardRef<HTMLDivElement, ColorPickerRootProps>(
	({ value, defaultValue = '#000000', onChange, alpha = true, className, children, ...rest }, ref) => {
		const [hsva, setHsva] = useState<HSVA>(() => hexToHsva(value ?? defaultValue) ?? DEFAULT);

		const onChangeRef = useRef(onChange);
		useEffect(() => {
			onChangeRef.current = onChange;
		});

		// Sync from a controlled `value`. Only update when the incoming hex differs
		// from what we'd emit, so dragging doesn't fight the controlled prop.
		useEffect(() => {
			if (value === undefined) return;
			const next = hexToHsva(value);
			if (next && hsvaToHex(next) !== hsvaToHex(hsva)) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setHsva(next);
			}
		}, [value, hsva]);

		const commit = useCallback((next: HSVA) => {
			setHsva(next);
			onChangeRef.current?.(hsvaToHex(next));
		}, []);

		const setSaturationValue = useCallback(
			(s: number, v: number) => commit({ ...hsva, s, v }),
			[hsva, commit],
		);
		const setHue = useCallback((h: number) => commit({ ...hsva, h }), [hsva, commit]);
		const setAlpha = useCallback((a: number) => commit({ ...hsva, a: clamp(a, 0, 1) }), [hsva, commit]);
		const setHex = useCallback(
			(hex: string) => {
				const next = hexToHsva(hex);
				if (next) commit(alpha ? next : { ...next, a: 1 });
			},
			[commit, alpha],
		);

		const rgba = useMemo(() => hsvaToRgba(hsva), [hsva]);
		const hex = useMemo(() => hsvaToHex(hsva, alpha), [hsva, alpha]);
		const hueColor = useMemo(() => {
			const { r, g, b } = hsvToRgb(hsva.h, 100, 100);
			return `rgb(${r}, ${g}, ${b})`;
		}, [hsva.h]);

		const ctx = useMemo<ColorPickerContextValue>(
			() => ({ hsva, rgba, hex, hueColor, setSaturationValue, setHue, setAlpha, setHex }),
			[hsva, rgba, hex, hueColor, setSaturationValue, setHue, setAlpha, setHex],
		);

		return (
			<ColorPickerContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</ColorPickerContext.Provider>
		);
	},
);

Root.displayName = 'ColorPicker.Root';

// ---------------------------------------------------------------------------
// Area (saturation / value)
// ---------------------------------------------------------------------------

const Area = React.forwardRef<HTMLDivElement, ColorPickerAreaProps>(
	({ className, style, onKeyDown, children, ...rest }, ref) => {
		const ctx = useColorPickerContext();
		const { ref: dragRef, handlers } = useTrackDrag<HTMLDivElement>((x, y) =>
			ctx.setSaturationValue(x * 100, (1 - y) * 100),
		);
		const mergedRef = useMergedRefs(dragRef, ref);

		return (
			<div
				ref={mergedRef}
				role='slider'
				tabIndex={0}
				aria-label='Saturation and brightness'
				aria-valuetext={`Saturation ${Math.round(ctx.hsva.s)}%, brightness ${Math.round(ctx.hsva.v)}%`}
				data-color-picker-area=''
				className={className}
				style={{
					position: 'relative',
					touchAction: 'none',
					backgroundColor: ctx.hueColor,
					backgroundImage:
						'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
					...style,
				}}
				{...rest}
				{...handlers}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					const { s, v } = ctx.hsva;
					if (e.key === 'ArrowLeft') {
						e.preventDefault();
						ctx.setSaturationValue(clamp(s - 1, 0, 100), v);
					} else if (e.key === 'ArrowRight') {
						e.preventDefault();
						ctx.setSaturationValue(clamp(s + 1, 0, 100), v);
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						ctx.setSaturationValue(s, clamp(v + 1, 0, 100));
					} else if (e.key === 'ArrowDown') {
						e.preventDefault();
						ctx.setSaturationValue(s, clamp(v - 1, 0, 100));
					} else if (e.key === 'PageUp') {
						e.preventDefault();
						ctx.setSaturationValue(s, clamp(v + 10, 0, 100));
					} else if (e.key === 'PageDown') {
						e.preventDefault();
						ctx.setSaturationValue(s, clamp(v - 10, 0, 100));
					} else if (e.key === 'Home') {
						e.preventDefault();
						ctx.setSaturationValue(0, v);
					} else if (e.key === 'End') {
						e.preventDefault();
						ctx.setSaturationValue(100, v);
					}
				}}>
				{children}
			</div>
		);
	},
);

Area.displayName = 'ColorPicker.Area';

const AreaThumb = React.forwardRef<HTMLDivElement, ColorPickerAreaThumbProps>(({ className, style, ...rest }, ref) => {
	const ctx = useColorPickerContext();
	return (
		<div
			ref={ref}
			data-color-picker-area-thumb=''
			className={className}
			style={{
				position: 'absolute',
				left: `${ctx.hsva.s}%`,
				top: `${100 - ctx.hsva.v}%`,
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				...style,
			}}
			{...rest}
		/>
	);
});

AreaThumb.displayName = 'ColorPicker.AreaThumb';

// ---------------------------------------------------------------------------
// Hue
// ---------------------------------------------------------------------------

const HUE_GRADIENT =
	'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

const Hue = React.forwardRef<HTMLDivElement, ColorPickerHueProps>(
	({ className, style, onKeyDown, children, ...rest }, ref) => {
		const ctx = useColorPickerContext();
		const { ref: dragRef, handlers } = useTrackDrag<HTMLDivElement>((x) => ctx.setHue(x * 360));
		const mergedRef = useMergedRefs(dragRef, ref);

		return (
			<div
				ref={mergedRef}
				role='slider'
				tabIndex={0}
				aria-label='Hue'
				aria-valuemin={0}
				aria-valuemax={360}
				aria-valuenow={Math.round(ctx.hsva.h)}
				data-color-picker-hue=''
				className={className}
				style={{ position: 'relative', touchAction: 'none', backgroundImage: HUE_GRADIENT, ...style }}
				{...rest}
				{...handlers}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
						e.preventDefault();
						ctx.setHue(clamp(ctx.hsva.h - 1, 0, 360));
					} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
						e.preventDefault();
						ctx.setHue(clamp(ctx.hsva.h + 1, 0, 360));
					} else if (e.key === 'PageDown') {
						e.preventDefault();
						ctx.setHue(clamp(ctx.hsva.h - 10, 0, 360));
					} else if (e.key === 'PageUp') {
						e.preventDefault();
						ctx.setHue(clamp(ctx.hsva.h + 10, 0, 360));
					} else if (e.key === 'Home') {
						e.preventDefault();
						ctx.setHue(0);
					} else if (e.key === 'End') {
						e.preventDefault();
						ctx.setHue(360);
					}
				}}>
				{children}
			</div>
		);
	},
);

Hue.displayName = 'ColorPicker.Hue';

const HueThumb = React.forwardRef<HTMLDivElement, ColorPickerHueThumbProps>(({ className, style, ...rest }, ref) => {
	const ctx = useColorPickerContext();
	return (
		<div
			ref={ref}
			data-color-picker-hue-thumb=''
			className={className}
			style={{
				position: 'absolute',
				left: `${(ctx.hsva.h / 360) * 100}%`,
				top: '50%',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				...style,
			}}
			{...rest}
		/>
	);
});

HueThumb.displayName = 'ColorPicker.HueThumb';

// ---------------------------------------------------------------------------
// Alpha
// ---------------------------------------------------------------------------

const Alpha = React.forwardRef<HTMLDivElement, ColorPickerAlphaProps>(
	({ className, style, onKeyDown, children, ...rest }, ref) => {
		const ctx = useColorPickerContext();
		const { ref: dragRef, handlers } = useTrackDrag<HTMLDivElement>((x) => ctx.setAlpha(x));
		const mergedRef = useMergedRefs(dragRef, ref);
		const { r, g, b } = ctx.rgba;

		return (
			<div
				ref={mergedRef}
				role='slider'
				tabIndex={0}
				aria-label='Alpha'
				aria-valuemin={0}
				aria-valuemax={1}
				aria-valuenow={Math.round(ctx.hsva.a * 100) / 100}
				data-color-picker-alpha=''
				className={className}
				style={{
					position: 'relative',
					touchAction: 'none',
					backgroundImage: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgb(${r}, ${g}, ${b}))`,
					...style,
				}}
				{...rest}
				{...handlers}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
						e.preventDefault();
						ctx.setAlpha(clamp(ctx.hsva.a - 0.01, 0, 1));
					} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
						e.preventDefault();
						ctx.setAlpha(clamp(ctx.hsva.a + 0.01, 0, 1));
					} else if (e.key === 'PageDown') {
						e.preventDefault();
						ctx.setAlpha(clamp(ctx.hsva.a - 0.1, 0, 1));
					} else if (e.key === 'PageUp') {
						e.preventDefault();
						ctx.setAlpha(clamp(ctx.hsva.a + 0.1, 0, 1));
					} else if (e.key === 'Home') {
						e.preventDefault();
						ctx.setAlpha(0);
					} else if (e.key === 'End') {
						e.preventDefault();
						ctx.setAlpha(1);
					}
				}}>
				{children}
			</div>
		);
	},
);

Alpha.displayName = 'ColorPicker.Alpha';

const AlphaThumb = React.forwardRef<HTMLDivElement, ColorPickerAlphaThumbProps>(({ className, style, ...rest }, ref) => {
	const ctx = useColorPickerContext();
	return (
		<div
			ref={ref}
			data-color-picker-alpha-thumb=''
			className={className}
			style={{
				position: 'absolute',
				left: `${ctx.hsva.a * 100}%`,
				top: '50%',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				...style,
			}}
			{...rest}
		/>
	);
});

AlphaThumb.displayName = 'ColorPicker.AlphaThumb';

// ---------------------------------------------------------------------------
// Swatch
// ---------------------------------------------------------------------------

const Swatch = React.forwardRef<HTMLDivElement, ColorPickerSwatchProps>(({ className, style, ...rest }, ref) => {
	const ctx = useColorPickerContext();
	const { r, g, b, a } = ctx.rgba;
	return (
		<div
			ref={ref}
			data-color-picker-swatch=''
			className={className}
			style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`, ...style }}
			{...rest}
		/>
	);
});

Swatch.displayName = 'ColorPicker.Swatch';

// ---------------------------------------------------------------------------
// Input (hex)
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, ColorPickerInputProps>(
	({ className, onBlur, onKeyDown, ...rest }, ref) => {
		const ctx = useColorPickerContext();
		const [draft, setDraft] = useState(ctx.hex);
		const focusedRef = useRef(false);

		// Keep the field in sync with the color unless the user is editing it.
		useEffect(() => {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			if (!focusedRef.current) setDraft(ctx.hex);
		}, [ctx.hex]);

		return (
			<input
				ref={ref}
				type='text'
				spellCheck={false}
				value={draft}
				aria-label='Hex color'
				className={className}
				{...rest}
				onFocus={(e) => {
					focusedRef.current = true;
					rest.onFocus?.(e);
				}}
				onChange={(e) => {
					setDraft(e.target.value);
					if (hexToHsvaValid(e.target.value)) ctx.setHex(e.target.value);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.key === 'Enter') ctx.setHex(draft);
				}}
				onBlur={(e) => {
					focusedRef.current = false;
					setDraft(ctx.hex);
					onBlur?.(e);
				}}
			/>
		);
	},
);

Input.displayName = 'ColorPicker.Input';

function hexToHsvaValid(hex: string) {
	return hexToHsva(hex) !== null;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ColorPicker = {
	Root,
	Area,
	AreaThumb,
	Hue,
	HueThumb,
	Alpha,
	AlphaThumb,
	Swatch,
	Input,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `ColorPicker.*`).
export { Root, Area, AreaThumb, Hue, HueThumb, Alpha, AlphaThumb, Swatch, Input };
