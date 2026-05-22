import { renderHook, act } from '@testing-library/react';
import { useStateMachine } from '@/hooks/use-state-machine';

type State = 'idle' | 'loading' | 'success' | 'error';
type Event = 'fetch' | 'resolve' | 'reject' | 'retry' | 'reset';

const config = {
	idle: { fetch: 'loading' },
	loading: { resolve: 'success', reject: 'error' },
	success: { reset: 'idle' },
	error: { retry: 'loading', reset: 'idle' },
} as const;

describe('useStateMachine', () => {
	it('starts in the initial state', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		expect(result.current.state).toBe('idle');
	});

	it('transitions to a new state when send is called with a valid event', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		act(() => result.current.send('fetch'));
		expect(result.current.state).toBe('loading');
	});

	it('ignores events with no transition from the current state', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		act(() => result.current.send('resolve'));
		expect(result.current.state).toBe('idle');
	});

	it('can reports whether an event is allowed', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		expect(result.current.can('fetch')).toBe(true);
		expect(result.current.can('resolve')).toBe(false);
	});

	it('exposes available transitions for the current state', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'loading' }),
		);
		expect([...result.current.transitions].sort()).toEqual(['reject', 'resolve']);
	});

	it('calls onTransition with next, prev, and event on successful transitions', () => {
		const onTransition = vi.fn();
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle', onTransition }),
		);
		act(() => result.current.send('fetch'));
		expect(onTransition).toHaveBeenCalledWith('loading', 'idle', 'fetch');
	});

	it('does not call onTransition for invalid events', () => {
		const onTransition = vi.fn();
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle', onTransition }),
		);
		act(() => result.current.send('resolve'));
		expect(onTransition).not.toHaveBeenCalled();
	});

	it('reset returns the machine to its initial state', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		act(() => result.current.send('fetch'));
		act(() => result.current.send('resolve'));
		expect(result.current.state).toBe('success');
		act(() => result.current.reset());
		expect(result.current.state).toBe('idle');
	});

	it('supports a full transition chain', () => {
		const { result } = renderHook(() =>
			useStateMachine<State, Event>(config, { initial: 'idle' }),
		);
		act(() => result.current.send('fetch'));
		expect(result.current.state).toBe('loading');
		act(() => result.current.send('reject'));
		expect(result.current.state).toBe('error');
		act(() => result.current.send('retry'));
		expect(result.current.state).toBe('loading');
		act(() => result.current.send('resolve'));
		expect(result.current.state).toBe('success');
	});
});
