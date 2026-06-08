'use client';

import { createContext, createSignal, createEffect, useContext, splitProps, type JSX } from 'solid-js';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	if (!ctx) throw new Error('ColorPicker sub-components must be used within ColorPicker.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Pointer-drag helper
// ---------------------------------------------------------------------------

function createTrackDrag<T extends HTMLElement>(onMove: (xRatio: number, yRatio: number) => void) {
	let el: T | undefined;
	let dragging = false;

	const setRef = (node: T) => {
		el = node;
	};

	const compute = (clientX: number, clientY: number) => {
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
		const y = clamp((clientY - rect.top) / (rect.height || 1), 0, 1);
		onMove(x, y);
	};

	const onPointerDown = (e: PointerEvent & { currentTarget: T }) => {
		dragging = true;
		e.currentTarget.setPointerCapture?.(e.pointerId);
		compute(e.clientX, e.clientY);
	};

	const onPointerMove = (e: PointerEvent & { currentTarget: T }) => {
		if (dragging) compute(e.clientX, e.clientY);
	};

	const onPointerUp = (e: PointerEvent & { currentTarget: T }) => {
		dragging = false;
		e.currentTarget.releasePointerCapture?.(e.pointerId);
	};

	return {
		setRef,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
	};
}

/** Call a consumer-provided event handler if present (consumer runs first). */
function callUser<E>(handler: unknown, e: E) {
	if (typeof handler === 'function') (handler as (event: E) => void)(e);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const DEFAULT: HSVA = { h: 0, s: 0, v: 0, a: 1 };

function Root(props: ColorPickerRootProps) {
	const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onChange', 'alpha', 'class', 'children']);

	const isAlpha = () => local.alpha ?? true;

	// Initial color, read once at setup (mirrors React's lazy useState initializer).
	// A controlled `value` is kept in sync afterwards by the effect below.
	// eslint-disable-next-line solid/reactivity
	const [hsva, setHsva] = createSignal<HSVA>(hexToHsva(local.value ?? local.defaultValue ?? '#000000') ?? DEFAULT);

	// Sync from a controlled `value`. Only update when the incoming hex differs
	// from what we'd emit, so dragging doesn't fight the controlled prop.
	createEffect(() => {
		if (local.value === undefined) return;
		const next = hexToHsva(local.value);
		if (next && hsvaToHex(next) !== hsvaToHex(hsva())) {
			setHsva(next);
		}
	});

	const commit = (next: HSVA) => {
		setHsva(next);
		local.onChange?.(hsvaToHex(next));
	};

	const setSaturationValue = (s: number, v: number) => commit({ ...hsva(), s, v });
	const setHue = (h: number) => commit({ ...hsva(), h });
	const setAlpha = (a: number) => commit({ ...hsva(), a: clamp(a, 0, 1) });
	const setHex = (hex: string) => {
		const next = hexToHsva(hex);
		if (next) commit(isAlpha() ? next : { ...next, a: 1 });
	};

	const rgba = () => hsvaToRgba(hsva());
	const hex = () => hsvaToHex(hsva(), isAlpha());
	const hueColor = () => {
		const { r, g, b } = hsvToRgb(hsva().h, 100, 100);
		return `rgb(${r}, ${g}, ${b})`;
	};

	const ctx: ColorPickerContextValue = {
		get hsva() {
			return hsva();
		},
		get rgba() {
			return rgba();
		},
		get hex() {
			return hex();
		},
		get hueColor() {
			return hueColor();
		},
		setSaturationValue,
		setHue,
		setAlpha,
		setHex,
	};

	return (
		<ColorPickerContext.Provider value={ctx}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</ColorPickerContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Area (saturation / value)
// ---------------------------------------------------------------------------

function Area(props: ColorPickerAreaProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'class',
		'style',
		'onKeyDown',
		'onPointerDown',
		'onPointerMove',
		'onPointerUp',
		'onPointerCancel',
		'children',
		'ref',
	]);
	const ctx = useColorPickerContext();
	const drag = createTrackDrag<HTMLDivElement>((x, y) => ctx.setSaturationValue(x * 100, (1 - y) * 100));
	const mergedRef = createMergedRefs<HTMLDivElement>(drag.setRef, (el) => local.ref?.(el));

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		callUser(local.onKeyDown, e);
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
		}
	};

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerDown, e);
		drag.onPointerDown(e);
	};
	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerMove, e);
		drag.onPointerMove(e);
	};
	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerUp, e);
		drag.onPointerUp(e);
	};
	const handlePointerCancel: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerCancel, e);
		drag.onPointerCancel(e);
	};

	return (
		<div
			ref={mergedRef}
			role='slider'
			tabIndex={0}
			aria-label='Saturation and brightness'
			aria-valuetext={`Saturation ${Math.round(ctx.hsva.s)}%, brightness ${Math.round(ctx.hsva.v)}%`}
			data-color-picker-area=''
			class={local.class}
			style={{
				position: 'relative',
				'touch-action': 'none',
				'background-color': ctx.hueColor,
				'background-image':
					'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
				...(local.style as JSX.CSSProperties),
			}}
			onKeyDown={handleKeyDown}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			{...rest}>
			{local.children}
		</div>
	);
}

function AreaThumb(props: ColorPickerAreaThumbProps) {
	const [local, rest] = splitProps(props, ['class', 'style']);
	const ctx = useColorPickerContext();
	return (
		<div
			data-color-picker-area-thumb=''
			class={local.class}
			style={{
				position: 'absolute',
				left: `${ctx.hsva.s}%`,
				top: `${100 - ctx.hsva.v}%`,
				transform: 'translate(-50%, -50%)',
				'pointer-events': 'none',
				...(local.style as JSX.CSSProperties),
			}}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Hue
// ---------------------------------------------------------------------------

const HUE_GRADIENT =
	'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

function Hue(props: ColorPickerHueProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'class',
		'style',
		'onKeyDown',
		'onPointerDown',
		'onPointerMove',
		'onPointerUp',
		'onPointerCancel',
		'children',
		'ref',
	]);
	const ctx = useColorPickerContext();
	const drag = createTrackDrag<HTMLDivElement>((x) => ctx.setHue(x * 360));
	const mergedRef = createMergedRefs<HTMLDivElement>(drag.setRef, (el) => local.ref?.(el));

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		callUser(local.onKeyDown, e);
		if (e.defaultPrevented) return;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			ctx.setHue(clamp(ctx.hsva.h - 1, 0, 360));
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			ctx.setHue(clamp(ctx.hsva.h + 1, 0, 360));
		}
	};

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerDown, e);
		drag.onPointerDown(e);
	};
	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerMove, e);
		drag.onPointerMove(e);
	};
	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerUp, e);
		drag.onPointerUp(e);
	};
	const handlePointerCancel: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerCancel, e);
		drag.onPointerCancel(e);
	};

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
			class={local.class}
			style={{
				position: 'relative',
				'touch-action': 'none',
				'background-image': HUE_GRADIENT,
				...(local.style as JSX.CSSProperties),
			}}
			onKeyDown={handleKeyDown}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			{...rest}>
			{local.children}
		</div>
	);
}

function HueThumb(props: ColorPickerHueThumbProps) {
	const [local, rest] = splitProps(props, ['class', 'style']);
	const ctx = useColorPickerContext();
	return (
		<div
			data-color-picker-hue-thumb=''
			class={local.class}
			style={{
				position: 'absolute',
				left: `${(ctx.hsva.h / 360) * 100}%`,
				top: '50%',
				transform: 'translate(-50%, -50%)',
				'pointer-events': 'none',
				...(local.style as JSX.CSSProperties),
			}}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Alpha
// ---------------------------------------------------------------------------

function Alpha(props: ColorPickerAlphaProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'class',
		'style',
		'onKeyDown',
		'onPointerDown',
		'onPointerMove',
		'onPointerUp',
		'onPointerCancel',
		'children',
		'ref',
	]);
	const ctx = useColorPickerContext();
	const drag = createTrackDrag<HTMLDivElement>((x) => ctx.setAlpha(x));
	const mergedRef = createMergedRefs<HTMLDivElement>(drag.setRef, (el) => local.ref?.(el));

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		callUser(local.onKeyDown, e);
		if (e.defaultPrevented) return;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			ctx.setAlpha(clamp(ctx.hsva.a - 0.01, 0, 1));
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			ctx.setAlpha(clamp(ctx.hsva.a + 0.01, 0, 1));
		}
	};

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerDown, e);
		drag.onPointerDown(e);
	};
	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerMove, e);
		drag.onPointerMove(e);
	};
	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerUp, e);
		drag.onPointerUp(e);
	};
	const handlePointerCancel: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerCancel, e);
		drag.onPointerCancel(e);
	};

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
			class={local.class}
			style={{
				position: 'relative',
				'touch-action': 'none',
				'background-image': `linear-gradient(to right, rgba(${ctx.rgba.r}, ${ctx.rgba.g}, ${ctx.rgba.b}, 0), rgb(${ctx.rgba.r}, ${ctx.rgba.g}, ${ctx.rgba.b}))`,
				...(local.style as JSX.CSSProperties),
			}}
			onKeyDown={handleKeyDown}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			{...rest}>
			{local.children}
		</div>
	);
}

function AlphaThumb(props: ColorPickerAlphaThumbProps) {
	const [local, rest] = splitProps(props, ['class', 'style']);
	const ctx = useColorPickerContext();
	return (
		<div
			data-color-picker-alpha-thumb=''
			class={local.class}
			style={{
				position: 'absolute',
				left: `${ctx.hsva.a * 100}%`,
				top: '50%',
				transform: 'translate(-50%, -50%)',
				'pointer-events': 'none',
				...(local.style as JSX.CSSProperties),
			}}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Swatch
// ---------------------------------------------------------------------------

function Swatch(props: ColorPickerSwatchProps) {
	const [local, rest] = splitProps(props, ['class', 'style']);
	const ctx = useColorPickerContext();
	return (
		<div
			data-color-picker-swatch=''
			class={local.class}
			style={{
				'background-color': `rgba(${ctx.rgba.r}, ${ctx.rgba.g}, ${ctx.rgba.b}, ${ctx.rgba.a})`,
				...(local.style as JSX.CSSProperties),
			}}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Input (hex)
// ---------------------------------------------------------------------------

function Input(props: ColorPickerInputProps & { ref?: (el: HTMLInputElement) => void }) {
	const [local, rest] = splitProps(props, ['class', 'onBlur', 'onKeyDown', 'onFocus', 'ref']);
	const ctx = useColorPickerContext();
	const [draft, setDraft] = createSignal(ctx.hex);
	let focused = false;

	// Keep the field in sync with the color unless the user is editing it.
	createEffect(() => {
		const next = ctx.hex;
		if (!focused) setDraft(next);
	});

	const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		focused = true;
		const userOnFocus = local.onFocus;
		if (typeof userOnFocus === 'function') {
			(userOnFocus as (event: typeof e) => void)(e);
		}
	};

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		const next = e.currentTarget.value;
		setDraft(next);
		if (hexToHsvaValid(next)) ctx.setHex(next);
	};

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.key === 'Enter') ctx.setHex(draft());
	};

	const handleBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = (e) => {
		focused = false;
		setDraft(ctx.hex);
		const userOnBlur = local.onBlur;
		if (typeof userOnBlur === 'function') {
			(userOnBlur as (event: typeof e) => void)(e);
		}
	};

	return (
		<input
			ref={local.ref}
			type='text'
			spellcheck={false}
			value={draft()}
			aria-label='Hex color'
			class={local.class}
			{...rest}
			onFocus={handleFocus}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
			onBlur={handleBlur}
		/>
	);
}

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

export { Root, Area, AreaThumb, Hue, HueThumb, Alpha, AlphaThumb, Swatch, Input };