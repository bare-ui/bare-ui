import { createRoot } from 'solid-js';
import { createStateMachine } from '@/primitives/create-state-machine';

type State = 'idle' | 'loading' | 'success' | 'error';
type Event = 'fetch' | 'resolve' | 'reject' | 'retry' | 'reset';

const config = {
	idle: { fetch: 'loading' as const },
	loading: { resolve: 'success' as const, reject: 'error' as const },
	success: { reset: 'idle' as const },
	error: { retry: 'loading' as const, reset: 'idle' as const },
};

describe('createStateMachine', () => {
	it('starts in the initial state', () => {
		createRoot((dispose) => {
			const { state } = createStateMachine<State, Event>(config, { initial: 'idle' });
			expect(state()).toBe('idle');
			dispose();
		});
	});

	it('transitions when send() is called with a valid event', () => {
		createRoot((dispose) => {
			const { state, send } = createStateMachine<State, Event>(config, { initial: 'idle' });
			send('fetch');
			expect(state()).toBe('loading');
			send('resolve');
			expect(state()).toBe('success');
			dispose();
		});
	});

	it('stays in current state when event has no transition', () => {
		createRoot((dispose) => {
			const { state, send } = createStateMachine<State, Event>(config, { initial: 'idle' });
			send('resolve');
			expect(state()).toBe('idle');
			dispose();
		});
	});

	it('can() reports whether a transition exists', () => {
		createRoot((dispose) => {
			const { can, send } = createStateMachine<State, Event>(config, { initial: 'idle' });
			expect(can('fetch')).toBe(true);
			expect(can('resolve')).toBe(false);
			send('fetch');
			expect(can('resolve')).toBe(true);
			expect(can('fetch')).toBe(false);
			dispose();
		});
	});

	it('reset() returns to the initial state', () => {
		createRoot((dispose) => {
			const { state, send, reset } = createStateMachine<State, Event>(config, { initial: 'idle' });
			send('fetch');
			send('reject');
			reset();
			expect(state()).toBe('idle');
			dispose();
		});
	});

	it('transitions reflects currently-available events', () => {
		createRoot((dispose) => {
			const { transitions, send } = createStateMachine<State, Event>(config, { initial: 'idle' });
			expect(transitions()).toEqual(['fetch']);
			send('fetch');
			expect(transitions()).toEqual(['resolve', 'reject']);
			dispose();
		});
	});

	it('onTransition is called with next, prev, and event', () => {
		const onTransition = vi.fn();
		createRoot((dispose) => {
			const { send } = createStateMachine<State, Event>(config, { initial: 'idle', onTransition });
			send('fetch');
			expect(onTransition).toHaveBeenCalledWith('loading', 'idle', 'fetch');
			dispose();
		});
	});

	it('onTransition is not called when send() does not transition', () => {
		const onTransition = vi.fn();
		createRoot((dispose) => {
			const { send } = createStateMachine<State, Event>(config, { initial: 'idle', onTransition });
			send('resolve');
			expect(onTransition).not.toHaveBeenCalled();
			dispose();
		});
	});
});
