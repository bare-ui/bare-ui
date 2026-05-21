import { useCallback, useMemo, useState } from 'react';

export type StateMachineConfig<TState extends string, TEvent extends string> = {
	[State in TState]: Partial<Record<TEvent, TState>>;
};

export interface UseStateMachineOptions<TState extends string, TEvent extends string> {
	/** Called after a successful transition. */
	onTransition?: (next: TState, prev: TState, event: TEvent) => void;
}

export interface UseStateMachineResult<TState extends string, TEvent extends string> {
	/** Current state. */
	state: TState;
	/** Dispatch an event. Ignored if the current state has no transition for it. */
	send: (event: TEvent) => void;
	/** `true` if the given event would transition from the current state. */
	can: (event: TEvent) => boolean;
	/** Reset to the initial state. */
	reset: () => void;
	/** All events that would transition from the current state. */
	transitions: TEvent[];
}

/**
 * A tiny, fully-typed finite state machine.
 *
 * Define states as keys, with each state's value mapping events to the next state.
 * Calling `send(event)` on a state that doesn't accept it is a silent no-op
 * (use `can(event)` to check first).
 *
 * @example
 * const { state, send, can } = useStateMachine({
 *   idle: { fetch: 'loading' },
 *   loading: { resolve: 'success', reject: 'error' },
 *   success: { reset: 'idle' },
 *   error: { retry: 'loading', reset: 'idle' },
 * } as const, { initial: 'idle' })
 */
export function useStateMachine<TState extends string, TEvent extends string>(
	config: StateMachineConfig<TState, TEvent>,
	init: { initial: TState } & UseStateMachineOptions<TState, TEvent>,
): UseStateMachineResult<TState, TEvent> {
	const { initial, onTransition } = init;
	const [state, setState] = useState<TState>(initial);

	const send = useCallback(
		(event: TEvent) => {
			setState((prev) => {
				const next = config[prev]?.[event];
				if (!next) return prev;
				onTransition?.(next, prev, event);
				return next;
			});
		},
		[config, onTransition],
	);

	const can = useCallback(
		(event: TEvent) => Boolean(config[state]?.[event]),
		[config, state],
	);

	const reset = useCallback(() => setState(initial), [initial]);

	const transitions = useMemo(
		() => Object.keys(config[state] ?? {}) as TEvent[],
		[config, state],
	);

	return { state, send, can, reset, transitions };
}
