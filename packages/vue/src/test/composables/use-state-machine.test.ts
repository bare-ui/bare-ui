import { useStateMachine } from '@/composables/use-state-machine';

type State = 'idle' | 'loading' | 'success' | 'error';
type Event = 'fetch' | 'resolve' | 'reject' | 'retry' | 'reset';

const config = {
	idle: { fetch: 'loading' as const },
	loading: { resolve: 'success' as const, reject: 'error' as const },
	success: { reset: 'idle' as const },
	error: { retry: 'loading' as const, reset: 'idle' as const },
};

describe('useStateMachine', () => {
	it('starts in the initial state', () => {
		const { state } = useStateMachine<State, Event>(config, { initial: 'idle' });
		expect(state.value).toBe('idle');
	});

	it('transitions when send() is called with a valid event', () => {
		const { state, send } = useStateMachine<State, Event>(config, { initial: 'idle' });
		send('fetch');
		expect(state.value).toBe('loading');
		send('resolve');
		expect(state.value).toBe('success');
	});

	it('stays in current state when event has no transition', () => {
		const { state, send } = useStateMachine<State, Event>(config, { initial: 'idle' });
		send('resolve');
		expect(state.value).toBe('idle');
	});

	it('can() reports whether a transition exists', () => {
		const { can, send } = useStateMachine<State, Event>(config, { initial: 'idle' });
		expect(can('fetch')).toBe(true);
		expect(can('resolve')).toBe(false);
		send('fetch');
		expect(can('resolve')).toBe(true);
		expect(can('fetch')).toBe(false);
	});

	it('reset() returns to the initial state', () => {
		const { state, send, reset } = useStateMachine<State, Event>(config, { initial: 'idle' });
		send('fetch');
		send('reject');
		reset();
		expect(state.value).toBe('idle');
	});

	it('transitions reflects currently-available events', () => {
		const { transitions, send } = useStateMachine<State, Event>(config, { initial: 'idle' });
		expect(transitions.value).toEqual(['fetch']);
		send('fetch');
		expect(transitions.value).toEqual(['resolve', 'reject']);
	});

	it('onTransition is called with next, prev, and event', () => {
		const onTransition = vi.fn();
		const { send } = useStateMachine<State, Event>(config, { initial: 'idle', onTransition });
		send('fetch');
		expect(onTransition).toHaveBeenCalledWith('loading', 'idle', 'fetch');
	});

	it('onTransition is not called when send() does not transition', () => {
		const onTransition = vi.fn();
		const { send } = useStateMachine<State, Event>(config, { initial: 'idle', onTransition });
		send('resolve');
		expect(onTransition).not.toHaveBeenCalled();
	});
});
