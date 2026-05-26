import {
	createContext,
	createEffect,
	createSignal,
	mergeProps,
	on,
	onCleanup,
	Show,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createReduceMotion } from '@/primitives/create-reduce-motion';
import type {
	TypewriterContextValue,
	TypewriterCursorProps,
	TypewriterRootProps,
	TypewriterState,
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
	if (!ctx) throw new Error('Typewriter.Text/Cursor must be used within Typewriter.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: TypewriterRootProps) {
	const merged = mergeProps(
		{
			speed: 30,
			mode: 'char' as const,
			startDelay: 0,
			autoStart: true,
			resetOnTextChange: false,
			loop: false,
			loopDelay: 1000,
		},
		props,
	);
	const [local, rest] = splitProps(merged, [
		'text',
		'speed',
		'mode',
		'startDelay',
		'autoStart',
		'resetOnTextChange',
		'loop',
		'loopDelay',
		'onComplete',
		'children',
		'class',
	]);

	const [count, setCount] = createSignal(0);
	// Bumped on each loop restart so the reveal effect re-runs from zero.
	const [cycle, setCycle] = createSignal(0);
	const reduceMotion = createReduceMotion();

	// The reveal chain reschedules itself with setTimeout, so it advances
	// independently of re-renders. `countRef` carries the live position across
	// ticks without forcing the effect to re-run on every token.
	let countRef = 0;
	let startedRef = false;
	let firedRef = false;

	const setBoth = (next: number) => {
		countRef = next;
		setCount(next);
	};

	// Restart from the beginning when text changes and the consumer opted in.
	createEffect(
		on(
			() => local.text,
			() => {
				if (local.resetOnTextChange) {
					firedRef = false;
					setBoth(0);
				}
			},
			{ defer: true },
		),
	);

	// Reduced motion reveals everything at once (derived, never animated).
	const revealed = () => (reduceMotion() ? local.text.length : Math.min(count(), local.text.length));

	// Reveal chain. Re-runs when `text` grows (streaming) or on loop restart;
	// each run picks up from the preserved `countRef`. Rescheduling happens
	// inside the timer callback, so it advances independently of re-renders.
	createEffect(
		on([() => local.text, () => local.autoStart, reduceMotion, () => local.speed, () => local.mode, cycle], () => {
			const text = local.text;
			if (!local.autoStart || reduceMotion()) return;
			if (countRef >= text.length) return;

			let cancelled = false;
			let timer: ReturnType<typeof setTimeout>;

			const tick = () => {
				if (cancelled) return;
				const c = countRef;
				if (c >= text.length) return;
				const next = local.mode === 'word' ? nextWordBoundary(text, c) : Math.min(c + 1, text.length);
				setBoth(next);
				if (next < text.length) timer = setTimeout(tick, local.speed);
			};

			const initial = startedRef ? 0 : local.startDelay;
			startedRef = true;
			timer = setTimeout(tick, initial);

			onCleanup(() => {
				cancelled = true;
				clearTimeout(timer);
			});
		}),
	);

	// Fire onComplete once per full reveal.
	createEffect(() => {
		if (local.text.length > 0 && revealed() >= local.text.length && !firedRef) {
			firedRef = true;
			local.onComplete?.();
		}
	});

	// Loop: clear and retype after a pause.
	createEffect(() => {
		if (!local.loop || reduceMotion() || local.text.length === 0 || revealed() < local.text.length) return;
		const t = setTimeout(() => {
			firedRef = false;
			setBoth(0);
			setCycle((c) => c + 1);
		}, local.loopDelay);
		onCleanup(() => clearTimeout(t));
	});

	const isTyping = () => revealed() < local.text.length;
	const state: TypewriterContextValue = {
		get displayed() {
			return local.text.slice(0, revealed());
		},
		get isTyping() {
			return isTyping();
		},
		get isDone() {
			return !isTyping();
		},
		get progress() {
			return local.text.length === 0 ? 1 : revealed() / local.text.length;
		},
	};

	const renderChildren = () => {
		const children = local.children;
		if (typeof children === 'function') return (children as (s: TypewriterState) => JSX.Element)(state);
		if (children !== undefined) return children as JSX.Element;
		return state.displayed;
	};

	return (
		<TypewriterContext.Provider value={state}>
			<span
				data-state={isTyping() ? 'typing' : 'done'}
				aria-busy={isTyping() || undefined}
				class={local.class}
				{...rest}>
				{renderChildren()}
			</span>
		</TypewriterContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

function Text(props: TypewriterTextProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useTypewriterContext();
	return (
		<span
			data-state={ctx.isTyping ? 'typing' : 'done'}
			class={local.class}
			{...rest}>
			{ctx.displayed}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Cursor
// ---------------------------------------------------------------------------

function Cursor(props: TypewriterCursorProps) {
	const merged = mergeProps({ keepMounted: false }, props);
	const [local, rest] = splitProps(merged, ['keepMounted', 'class', 'children']);
	const ctx = useTypewriterContext();

	return (
		<Show when={local.keepMounted || !ctx.isDone}>
			<span
				aria-hidden='true'
				data-state={ctx.isTyping ? 'typing' : 'done'}
				class={local.class}
				{...rest}>
				{local.children}
			</span>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Typewriter = {
	Root,
	Text,
	Cursor,
};
