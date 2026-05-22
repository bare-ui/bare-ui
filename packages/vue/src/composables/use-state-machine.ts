import { computed, ref, type ComputedRef, type Ref } from 'vue';

export type StateMachineConfig<TState extends string, TEvent extends string> = {
	[State in TState]: Partial<Record<TEvent, TState>>;
};

export interface UseStateMachineOptions<TState extends string, TEvent extends string> {
	/** Called after a successful transition. */
	onTransition?: (next: TState, prev: TState, event: TEvent) => void;
}

export interface UseStateMachineResult<TState extends string, TEvent extends string> {
	/** Current state. */
	state: Ref<TState>;
	/** Dispatch an event. Ignored if the current state has no transition for it. */
	send: (event: TEvent) => void;
	/** `true` if the given event would transition from the current state. */
	can: (event: TEvent) => boolean;
	/** Reset to the initial state. */
	reset: () => void;
	/** All events that would transition from the current state. */
	transitions: ComputedRef<TEvent[]>;
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
	const state = ref(initial) as Ref<TState>;

	function send(event: TEvent) {
		const next = config[state.value]?.[event];
		if (!next) return;
		const prev = state.value;
		state.value = next;
		onTransition?.(next, prev, event);
	}

	function can(event: TEvent): boolean {
		return Boolean(config[state.value]?.[event]);
	}

	function reset() {
		state.value = initial;
	}

	const transitions = computed(() => Object.keys(config[state.value] ?? {}) as TEvent[]);

	return { state, send, can, reset, transitions };
}
