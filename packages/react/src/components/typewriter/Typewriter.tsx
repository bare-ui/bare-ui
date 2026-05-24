import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import type {
	TypewriterContextValue,
	TypewriterCursorProps,
	TypewriterRootProps,
	TypewriterTextProps,
} from './Typewriter.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the index one whole word (plus trailing whitespace) past `from`. */
function nextWordBoundary(text: string, from: number): number {
	const rest = text.slice(from);
	const match = rest.match(/^\s*\S+\s*/);
	return match ? from + match[0].length : text.length;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TypewriterContext = createContext<TypewriterContextValue | null>(null);

function useTypewriterContext() {
	const ctx = useContext(TypewriterContext);
	if (!ctx) throw new globalThis.Error('Typewriter.Text/Cursor must be used within Typewriter.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLSpanElement, TypewriterRootProps>(
	(
		{
			text,
			speed = 30,
			mode = 'char',
			startDelay = 0,
			autoStart = true,
			resetOnTextChange = false,
			loop = false,
			loopDelay = 1000,
			onComplete,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [count, setCount] = useState(0);
		// Bumped on each loop restart so the reveal effect re-runs from zero.
		const [cycle, setCycle] = useState(0);
		const reduceMotion = useReduceMotion();

		// The reveal chain reschedules itself with setTimeout, so it advances
		// independently of React re-renders. `countRef` carries the live position
		// across ticks without forcing the effect to re-run on every token.
		const countRef = useRef(0);
		const startedRef = useRef(false);
		const firedRef = useRef(false);
		const onCompleteRef = useRef(onComplete);
		useEffect(() => {
			onCompleteRef.current = onComplete;
		});

		const setBoth = useCallback((next: number) => {
			countRef.current = next;
			setCount(next);
		}, []);

		// Restart from the beginning when text changes and the consumer opted in.
		useEffect(() => {
			if (resetOnTextChange) {
				firedRef.current = false;
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setBoth(0);
			}
		}, [text, resetOnTextChange, setBoth]);

		// Reduced motion reveals everything at once (derived, never animated).
		const revealed = reduceMotion ? text.length : Math.min(count, text.length);

		// Reveal chain. Re-runs when `text` grows (streaming) or on loop restart;
		// each run picks up from the preserved `countRef`. Rescheduling happens
		// inside the timer callback, so it advances independently of re-renders.
		useEffect(() => {
			if (!autoStart || reduceMotion) return;
			if (countRef.current >= text.length) return;

			let cancelled = false;
			let timer: ReturnType<typeof globalThis.setTimeout>;

			const tick = () => {
				if (cancelled) return;
				const c = countRef.current;
				if (c >= text.length) return;
				const next = mode === 'word' ? nextWordBoundary(text, c) : Math.min(c + 1, text.length);
				setBoth(next);
				if (next < text.length) timer = globalThis.setTimeout(tick, speed);
			};

			const initial = startedRef.current ? 0 : startDelay;
			startedRef.current = true;
			timer = globalThis.setTimeout(tick, initial);

			return () => {
				cancelled = true;
				globalThis.clearTimeout(timer);
			};
		}, [text, autoStart, reduceMotion, speed, mode, startDelay, cycle, setBoth]);

		// Fire onComplete once per full reveal.
		useEffect(() => {
			if (text.length > 0 && revealed >= text.length && !firedRef.current) {
				firedRef.current = true;
				onCompleteRef.current?.();
			}
		}, [revealed, text.length]);

		// Loop: clear and retype after a pause.
		useEffect(() => {
			if (!loop || reduceMotion || text.length === 0 || revealed < text.length) return;
			const t = globalThis.setTimeout(() => {
				firedRef.current = false;
				setBoth(0);
				setCycle((c) => c + 1);
			}, loopDelay);
			return () => globalThis.clearTimeout(t);
		}, [loop, reduceMotion, revealed, text.length, loopDelay, setBoth]);

		const isTyping = revealed < text.length;
		const state: TypewriterContextValue = {
			displayed: text.slice(0, revealed),
			isTyping,
			isDone: !isTyping,
			progress: text.length === 0 ? 1 : revealed / text.length,
		};

		return (
			<TypewriterContext.Provider value={state}>
				<span
					ref={ref}
					className={className}
					data-state={isTyping ? 'typing' : 'done'}
					aria-busy={isTyping || undefined}
					{...rest}>
					{typeof children === 'function' ? children(state)
					: children !== undefined ? children
					: state.displayed}
				</span>
			</TypewriterContext.Provider>
		);
	},
);

Root.displayName = 'Typewriter.Root';

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

const Text = React.forwardRef<HTMLSpanElement, TypewriterTextProps>(({ className, ...rest }, ref) => {
	const ctx = useTypewriterContext();
	return (
		<span
			ref={ref}
			className={className}
			data-state={ctx.isTyping ? 'typing' : 'done'}
			{...rest}>
			{ctx.displayed}
		</span>
	);
});

Text.displayName = 'Typewriter.Text';

// ---------------------------------------------------------------------------
// Cursor
// ---------------------------------------------------------------------------

const Cursor = React.forwardRef<HTMLSpanElement, TypewriterCursorProps>(
	({ keepMounted = false, className, children, ...rest }, ref) => {
		const ctx = useTypewriterContext();
		if (!keepMounted && ctx.isDone) return null;

		return (
			<span
				ref={ref}
				aria-hidden='true'
				className={className}
				data-state={ctx.isTyping ? 'typing' : 'done'}
				{...rest}>
				{children}
			</span>
		);
	},
);

Cursor.displayName = 'Typewriter.Cursor';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Typewriter = {
	Root,
	Text,
	Cursor,
};
