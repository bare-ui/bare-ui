import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type { SliderImplProps, SliderOrientation, SliderProps, SliderValue } from './Slider.types';

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

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

const SliderImpl = React.forwardRef<HTMLDivElement, SliderImplProps>((props, ref) => {
	const {
		min = 0,
		max = 100,
		step = 1,
		orientation = 'horizontal',
		disabled = false,
		inverted = false,
		className,
		children: _children,
		// Strip props that don't belong on the underlying <div>
		value: _v,
		defaultValue: _dv,
		onChange: _oc,
		range: _r,
		...rest
	} = props;
	void _v;
	void _dv;
	void _oc;
	void _r;
	void _children;

	const range = props.range === true;

	// --- Controlled / uncontrolled value state -------------------------------
	const initial: SliderValue = range
		? ((props.defaultValue as [number, number] | undefined) ?? [min, max])
		: [(props.defaultValue as number | undefined) ?? min];

	const [uncontrolled, setUncontrolled] = useState<SliderValue>(() => {
		const decimals = getDecimals(step);
		return initial.map((v) => roundFixed(clamp(snapToStep(v, min, step), min, max), decimals));
	});

	const isControlled = props.value !== undefined;
	const controlledValue: SliderValue | undefined = (() => {
		if (props.value === undefined) return undefined;
		return Array.isArray(props.value) ? props.value : [props.value];
	})();
	const value: SliderValue = isControlled ? (controlledValue as SliderValue) : uncontrolled;

	const decimals = getDecimals(step);

	const emit = useCallback(
		(next: SliderValue) => {
			const decimalsLocal = getDecimals(step);
			const normalized = next.map((v) => roundFixed(clamp(snapToStep(v, min, step), min, max), decimalsLocal));
			if (range) {
				// Keep ordering: lower thumb cannot pass upper thumb
				if (normalized[0] > normalized[1]) [normalized[0], normalized[1]] = [normalized[1], normalized[0]];
			}
			if (arraysEqual(normalized, value)) return;
			if (!isControlled) setUncontrolled(normalized);
			if (range) (props.onChange as ((v: [number, number]) => void) | undefined)?.([normalized[0], normalized[1]]);
			else (props.onChange as ((v: number) => void) | undefined)?.(normalized[0]);
		},
		[isControlled, min, max, step, range, props.onChange, value],
	);

	// --- Track / thumb interaction ------------------------------------------
	const trackRef = useRef<HTMLDivElement | null>(null);
	const draggingRef = useRef<{ thumbIndex: number } | null>(null);

	const setMergedRef = useMergedRefs<HTMLDivElement>(trackRef, ref);

	const valueFromPoint = useCallback(
		(clientX: number, clientY: number): number => {
			const el = trackRef.current;
			if (!el) return min;
			const rect = el.getBoundingClientRect();
			const isHorizontal = orientation === 'horizontal';
			const start = isHorizontal ? rect.left : rect.top;
			const length = isHorizontal ? rect.width : rect.height;
			const point = isHorizontal ? clientX : clientY;
			let pct = (point - start) / length;
			if (!isHorizontal) pct = inverted ? pct : 1 - pct; // vertical default = bottom→top
			else if (inverted) pct = 1 - pct;
			pct = clamp(pct, 0, 1);
			return min + pct * (max - min);
		},
		[orientation, min, max, inverted],
	);

	const closestThumb = useCallback(
		(target: number): number => {
			if (!range) return 0;
			const da = Math.abs(target - value[0]);
			const db = Math.abs(target - value[1]);
			return da <= db ? 0 : 1;
		},
		[range, value],
	);

	const updateThumb = useCallback(
		(thumbIndex: number, target: number) => {
			const next = value.slice();
			next[thumbIndex] = target;
			emit(next);
		},
		[value, emit],
	);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (disabled) return;
		const target = valueFromPoint(e.clientX, e.clientY);
		const thumbIndex = closestThumb(target);
		draggingRef.current = { thumbIndex };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		updateThumb(thumbIndex, target);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		const target = valueFromPoint(e.clientX, e.clientY);
		updateThumb(draggingRef.current.thumbIndex, target);
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		draggingRef.current = null;
	};

	// Cancel drag on unmount.
	useEffect(() => () => { draggingRef.current = null; }, []);

	// --- Keyboard ------------------------------------------------------------
	const handleThumbKeyDown = (thumbIndex: number) => (e: React.KeyboardEvent<HTMLSpanElement>) => {
		if (disabled) return;
		const horizontal = orientation === 'horizontal';
		const incKey = horizontal ? (inverted ? 'ArrowLeft' : 'ArrowRight') : (inverted ? 'ArrowDown' : 'ArrowUp');
		const decKey = horizontal ? (inverted ? 'ArrowRight' : 'ArrowLeft') : (inverted ? 'ArrowUp' : 'ArrowDown');
		const big = step * 10;

		let delta = 0;
		if (e.key === incKey) delta = step;
		else if (e.key === decKey) delta = -step;
		else if (e.key === 'PageUp') delta = big;
		else if (e.key === 'PageDown') delta = -big;
		else if (e.key === 'Home') {
			e.preventDefault();
			updateThumb(thumbIndex, min);
			return;
		} else if (e.key === 'End') {
			e.preventDefault();
			updateThumb(thumbIndex, max);
			return;
		} else return;

		e.preventDefault();
		updateThumb(thumbIndex, value[thumbIndex] + delta);
	};

	// --- Render --------------------------------------------------------------
	const pct = useMemo(() => value.map((v) => ((v - min) / (max - min)) * 100), [value, min, max]);
	const fillStart = range ? Math.min(pct[0], pct[1]) : 0;
	const fillEnd = range ? Math.max(pct[0], pct[1]) : pct[0];

	const isHorizontal = orientation === 'horizontal';
	const fillStyle: React.CSSProperties = isHorizontal
		? { left: `${fillStart}%`, width: `${fillEnd - fillStart}%`, top: 0, bottom: 0 }
		: inverted
			? { top: `${fillStart}%`, height: `${fillEnd - fillStart}%`, left: 0, right: 0 }
			: { bottom: `${fillStart}%`, height: `${fillEnd - fillStart}%`, left: 0, right: 0 };

	const thumbStyle = (i: number): React.CSSProperties => {
		const p = pct[i];
		if (isHorizontal) {
			return inverted
				? { right: `${p}%`, top: '50%', transform: 'translate(50%, -50%)' }
				: { left: `${p}%`, top: '50%', transform: 'translate(-50%, -50%)' };
		}
		return inverted
			? { top: `${p}%`, left: '50%', transform: 'translate(-50%, -50%)' }
			: { bottom: `${p}%`, left: '50%', transform: 'translate(-50%, 50%)' };
	};

	return (
		<div
			ref={setMergedRef}
			role={range ? 'group' : undefined}
			aria-label={range ? (rest as { 'aria-label'?: string })['aria-label'] : undefined}
			className={className}
			data-orientation={orientation}
			data-disabled={disabled ? '' : undefined}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			style={{ position: 'relative', userSelect: 'none', touchAction: 'none', ...(rest as { style?: React.CSSProperties }).style }}
			{...stripStyleAndChildren(rest as Record<string, unknown>)}>
			<span data-part='track' style={{ position: 'absolute', inset: 0 }} />
			<span data-part='fill' style={{ position: 'absolute', ...fillStyle }} />
			{value.map((v, i) => (
				<span
					key={i}
					role='slider'
					tabIndex={disabled ? -1 : 0}
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={roundFixed(v, decimals)}
					aria-orientation={orientation}
					aria-disabled={disabled || undefined}
					data-part='thumb'
					data-thumb-index={i}
					data-disabled={disabled ? '' : undefined}
					onKeyDown={handleThumbKeyDown(i)}
					style={{ position: 'absolute', ...thumbStyle(i) }}
				/>
			))}
		</div>
	);
});

SliderImpl.displayName = 'Slider';

// `style` and `aria-label` are extracted; pass everything else through.
function stripStyleAndChildren<T extends Record<string, unknown>>(props: T): Omit<T, 'style' | 'aria-label'> {
	const { style: _s, ['aria-label']: _a, ...rest } = props;
	void _s;
	void _a;
	return rest as Omit<T, 'style' | 'aria-label'>;
}

export const Slider = SliderImpl as React.ForwardRefExoticComponent<
	SliderProps & React.RefAttributes<HTMLDivElement>
>;

function _orientationGuard(_o: SliderOrientation) { /* keeps SliderOrientation imported for declaration files */ }
void _orientationGuard;
