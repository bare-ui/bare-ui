import { createMemo, createSignal, onCleanup, splitProps, Index, type JSX } from 'solid-js';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type { SliderImplProps, SliderOrientation, SliderValue } from './Slider.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max);
}

function snapToStep(value: number, min: number, step: number) {
	const stepped = Math.round((value - min) / step) * step + min;
	return Number.isFinite(stepped) ? stepped : value;
}

function getDecimals(step: number) {
	const s = step.toString();
	const dot = s.indexOf('.');
	return dot === -1 ? 0 : s.length - dot - 1;
}

function roundFixed(value: number, decimals: number) {
	const factor = Math.pow(10, decimals);
	return Math.round(value * factor) / factor;
}

function arraysEqual(a: SliderValue, b: SliderValue) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}

/** Call a consumer-provided event handler if present (consumer runs first). */
function callUser<E>(handler: unknown, e: E) {
	if (typeof handler === 'function') (handler as (event: E) => void)(e);
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

// The implementation is typed with the flat `SliderImplProps` so Storybook's
// docgen reads a single clean description per prop; consumers get the
// discriminated `SliderProps` union via the cast on the `Slider` export below.
function SliderImpl(props: SliderImplProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(
		props,
		[
			'min',
			'max',
			'step',
			'orientation',
			'disabled',
			'inverted',
			'range',
			'value',
			'defaultValue',
			'onChange',
			'class',
			'style',
			'children',
			'ref',
			'aria-label',
			'aria-labelledby',
			'onPointerDown',
			'onPointerMove',
			'onPointerUp',
			'onPointerCancel',
		],
	);

	const min = () => local.min ?? 0;
	const max = () => local.max ?? 100;
	const step = () => local.step ?? 1;
	const orientation = (): SliderOrientation => local.orientation ?? 'horizontal';
	const disabled = () => local.disabled ?? false;
	const inverted = () => local.inverted ?? false;
	const range = () => local.range === true;

	// --- Controlled / uncontrolled value state -------------------------------
	const initial = (): SliderValue =>
		range()
			? ((local.defaultValue as [number, number] | undefined) ?? [min(), max()])
			: [(local.defaultValue as number | undefined) ?? min()];

	const normalize = (next: SliderValue): SliderValue => {
		const decimals = getDecimals(step());
		return next.map((v) => roundFixed(clamp(snapToStep(v, min(), step()), min(), max()), decimals));
	};

	// Read once at setup (mirrors React's lazy useState initializer).
	const [uncontrolled, setUncontrolled] = createSignal<SliderValue>(normalize(initial()));

	const isControlled = () => local.value !== undefined;
	const controlledValue = (): SliderValue | undefined => {
		if (local.value === undefined) return undefined;
		return Array.isArray(local.value) ? local.value : [local.value];
	};
	const value = (): SliderValue => (isControlled() ? (controlledValue() as SliderValue) : uncontrolled());

	const decimals = () => getDecimals(step());

	const emit = (next: SliderValue) => {
		const normalized = normalize(next);
		if (range()) {
			// Keep ordering: lower thumb cannot pass upper thumb
			if (normalized[0] > normalized[1]) [normalized[0], normalized[1]] = [normalized[1], normalized[0]];
		}
		if (arraysEqual(normalized, value())) return;
		if (!isControlled()) setUncontrolled(normalized);
		if (range()) (local.onChange as ((v: [number, number]) => void) | undefined)?.([normalized[0], normalized[1]]);
		else (local.onChange as ((v: number) => void) | undefined)?.(normalized[0]);
	};

	// --- Track / thumb interaction ------------------------------------------
	let trackEl: HTMLDivElement | undefined;
	let dragging: { thumbIndex: number } | null = null;

	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (trackEl = el),
		(el) => local.ref?.(el),
	);

	const valueFromPoint = (clientX: number, clientY: number): number => {
		const el = trackEl;
		if (!el) return min();
		const rect = el.getBoundingClientRect();
		const isHorizontal = orientation() === 'horizontal';
		const start = isHorizontal ? rect.left : rect.top;
		const length = isHorizontal ? rect.width : rect.height;
		const point = isHorizontal ? clientX : clientY;
		let pct = (point - start) / length;
		if (!isHorizontal) pct = inverted() ? pct : 1 - pct; // vertical default = bottom→top
		else if (inverted()) pct = 1 - pct;
		pct = clamp(pct, 0, 1);
		return min() + pct * (max() - min());
	};

	const closestThumb = (target: number): number => {
		if (!range()) return 0;
		const v = value();
		const da = Math.abs(target - v[0]);
		const db = Math.abs(target - v[1]);
		return da <= db ? 0 : 1;
	};

	const updateThumb = (thumbIndex: number, target: number) => {
		const next = value().slice();
		next[thumbIndex] = target;
		emit(next);
	};

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerDown, e);
		if (disabled()) return;
		const target = valueFromPoint(e.clientX, e.clientY);
		const thumbIndex = closestThumb(target);
		dragging = { thumbIndex };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		updateThumb(thumbIndex, target);
	};

	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerMove, e);
		if (!dragging) return;
		const target = valueFromPoint(e.clientX, e.clientY);
		updateThumb(dragging.thumbIndex, target);
	};

	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerUp, e);
		if (!dragging) return;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		dragging = null;
	};

	const handlePointerCancel: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		callUser(local.onPointerCancel, e);
		if (!dragging) return;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		dragging = null;
	};

	// Cancel drag on unmount.
	onCleanup(() => {
		dragging = null;
	});

	// --- Keyboard ------------------------------------------------------------
	// Factory returns an event handler (attached to onKeyDown), so reading
	// reactive accessors inside is intentional.
	const handleThumbKeyDown =
		(thumbIndex: number): JSX.EventHandler<HTMLSpanElement, KeyboardEvent> =>
		// eslint-disable-next-line solid/reactivity
		(e) => {
			if (disabled()) return;
			const horizontal = orientation() === 'horizontal';
			const incKey = horizontal ? (inverted() ? 'ArrowLeft' : 'ArrowRight') : inverted() ? 'ArrowDown' : 'ArrowUp';
			const decKey = horizontal ? (inverted() ? 'ArrowRight' : 'ArrowLeft') : inverted() ? 'ArrowUp' : 'ArrowDown';
			const big = step() * 10;

			let delta = 0;
			if (e.key === incKey) delta = step();
			else if (e.key === decKey) delta = -step();
			else if (e.key === 'PageUp') delta = big;
			else if (e.key === 'PageDown') delta = -big;
			else if (e.key === 'Home') {
				e.preventDefault();
				updateThumb(thumbIndex, min());
				return;
			} else if (e.key === 'End') {
				e.preventDefault();
				updateThumb(thumbIndex, max());
				return;
			} else return;

			e.preventDefault();
			updateThumb(thumbIndex, value()[thumbIndex] + delta);
		};

	// --- Render --------------------------------------------------------------
	const pct = createMemo(() => value().map((v) => ((v - min()) / (max() - min())) * 100));
	const fillStart = () => (range() ? Math.min(pct()[0], pct()[1]) : 0);
	const fillEnd = () => (range() ? Math.max(pct()[0], pct()[1]) : pct()[0]);

	const isHorizontal = () => orientation() === 'horizontal';

	// Each thumb is an ARIA input field and needs its own accessible name. In
	// single mode it inherits the consumer's label directly. In range mode the
	// group carries the overall label, so each thumb gets a distinguishing name.
	// `aria-labelledby` (single mode) takes precedence over `aria-label`.
	const thumbLabelledBy = (): string | undefined => (!range() ? local['aria-labelledby'] : undefined);
	const thumbLabel = (i: number): string | undefined => {
		if (thumbLabelledBy()) return undefined;
		const ariaLabel = local['aria-label'];
		if (range()) return [i === 0 ? 'Minimum' : 'Maximum', ariaLabel].filter(Boolean).join(' ') || undefined;
		return ariaLabel || undefined;
	};

	const fillStyle = (): JSX.CSSProperties =>
		isHorizontal()
			? { left: `${fillStart()}%`, width: `${fillEnd() - fillStart()}%`, top: 0, bottom: 0 }
			: inverted()
				? { top: `${fillStart()}%`, height: `${fillEnd() - fillStart()}%`, left: 0, right: 0 }
				: { bottom: `${fillStart()}%`, height: `${fillEnd() - fillStart()}%`, left: 0, right: 0 };

	const thumbStyle = (i: number): JSX.CSSProperties => {
		const p = pct()[i];
		if (isHorizontal()) {
			return inverted()
				? { right: `${p}%`, top: '50%', transform: 'translate(50%, -50%)' }
				: { left: `${p}%`, top: '50%', transform: 'translate(-50%, -50%)' };
		}
		return inverted()
			? { top: `${p}%`, left: '50%', transform: 'translate(-50%, -50%)' }
			: { bottom: `${p}%`, left: '50%', transform: 'translate(-50%, 50%)' };
	};

	const rootStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = {
			position: 'relative',
			'user-select': 'none',
			'touch-action': 'none',
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			ref={mergedRef}
			role={range() ? 'group' : undefined}
			aria-label={range() ? local['aria-label'] : undefined}
				aria-labelledby={range() ? local['aria-labelledby'] : undefined}
			class={local.class}
			data-orientation={orientation()}
			data-disabled={disabled() ? '' : undefined}
			style={rootStyle()}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			{...rest}>
			<span
				data-part='track'
				style={{ position: 'absolute', inset: 0 }}
			/>
			<span
				data-part='fill'
				style={{ position: 'absolute', ...fillStyle() }}
			/>
			<Index each={value()}>
				{(v, i) => (
					<span
						role='slider'
						tabindex={disabled() ? -1 : 0}
						aria-label={thumbLabel(i)}
						aria-labelledby={thumbLabelledBy()}
						aria-valuemin={min()}
						aria-valuemax={max()}
						aria-valuenow={roundFixed(v(), decimals())}
						aria-orientation={orientation()}
						aria-disabled={disabled() || undefined}
						data-part='thumb'
						data-thumb-index={i}
						data-disabled={disabled() ? '' : undefined}
						onKeyDown={handleThumbKeyDown(i)}
						style={{ position: 'absolute', ...thumbStyle(i) }}
					/>
				)}
			</Index>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

// Public component is typed with the flat `SliderImplProps` so Storybook's
// docgen (which reads the declared type) shows one clean description per prop.
// The discriminated `SliderProps` union remains exported for consumers who want
// strict single/range narrowing.
export const Slider = SliderImpl as unknown as (
	props: SliderImplProps & { ref?: (el: HTMLDivElement) => void },
) => JSX.Element;
