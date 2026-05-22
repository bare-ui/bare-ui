import { createMemo, createSignal, type Accessor } from 'solid-js';

export type StateMachineConfig<TState extends string, TEvent extends string> = {
	[State in TState]: Partial<Record<TEvent, TState>>;
};

export interface CreateStateMachineOptions<TState extends string, TEvent extends string> {
	/** Initial state. */
	initial: TState;
	/** Called after a successful transition. */
	onTransition?: (next: TState, prev: TState, event: TEvent) => void;
}

export interface CreateStateMachineResult<TState extends string, TEvent extends string> {
	/** Reactive accessor for the current state. */
	state: Accessor<TState>;
	/** Dispatch an event. Ignored if the current state has no transition for it. */
	send: (event: TEvent) => void;
	/** `true` if the given event would transition from the current state. */
	can: (event: TEvent) => boolean;
	/** Reset to the initial state. */
	reset: () => void;
	/** Reactive accessor — all events that would transition from the current state. */
	transitions: Accessor<TEvent[]>;
}

/**
 * A tiny, fully-typed finite state machine.
 *
 * Define states as keys, with each state's value mapping events to the next state.
 * Calling `send(event)` on a state that doesn't accept it is a silent no-op
 * (use `can(event)` to check first).
 *
 * @example
 * const { state, send, can } = createStateMachine({
 *   idle: { fetch: 'loading' },
 *   loading: { resolve: 'success', reject: 'error' },
 *   success: { reset: 'idle' },
 *   error: { retry: 'loading', reset: 'idle' },
 * } as const, { initial: 'idle' })
 */
export function createStateMachine<TState extends string, TEvent extends string>(
	config: StateMachineConfig<TState, TEvent>,
	options: CreateStateMachineOptions<TState, TEvent>,
): CreateStateMachineResult<TState, TEvent> {
	const { initial, onTransition } = options;
	const [state, setState] = createSignal<TState>(initial);

	const send = (event: TEvent) => {
		const prev = state();
		const next = config[prev]?.[event];
		if (!next) return;
		setState(() => next);
		onTransition?.(next, prev, event);
	};

	const can = (event: TEvent) => Boolean(config[state()]?.[event]);

	const reset = () => setState(() => initial);

	const transitions = createMemo(() => Object.keys(config[state()] ?? {}) as TEvent[]);

	return { state, send, can, reset, transitions };
}
