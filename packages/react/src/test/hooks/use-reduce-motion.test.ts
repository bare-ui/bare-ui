import { renderHook, act } from '@testing-library/react';
import { useReduceMotion } from '@/hooks/use-reduce-motion';

type MqlListener = (e: { matches: boolean }) => void;

interface MockMql {
	matches: boolean;
	media: string;
	listeners: Set<MqlListener>;
	addEventListener: (type: string, cb: MqlListener) => void;
	removeEventListener: (type: string, cb: MqlListener) => void;
	dispatchEvent: (matches: boolean) => void;
	onchange: null;
}

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const registry = new Map<string, MockMql>();

function getOrCreateMql(query: string): MockMql {
	let mql = registry.get(query);
	if (!mql) {
		const listeners = new Set<MqlListener>();
		mql = {
			matches: false,
			media: query,
			listeners,
			onchange: null,
			addEventListener: (_type, cb) => {
				listeners.add(cb);
			},
			removeEventListener: (_type, cb) => {
				listeners.delete(cb);
			},
			dispatchEvent: (matches: boolean) => {
				mql!.matches = matches;
				listeners.forEach((cb) => cb({ matches }));
			},
		};
		registry.set(query, mql);
	}
	return mql;
}

describe('useReduceMotion', () => {
	beforeEach(() => {
		registry.clear();
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			configurable: true,
			value: vi.fn((query: string) => getOrCreateMql(query)),
		});
	});

	it('returns false when reduce-motion is not preferred', () => {
		const { result } = renderHook(() => useReduceMotion());
		expect(result.current).toBe(false);
	});

	it('returns true when reduce-motion is preferred', () => {
		getOrCreateMql(REDUCE_MOTION_QUERY).matches = true;
		const { result } = renderHook(() => useReduceMotion());
		expect(result.current).toBe(true);
	});

	it('queries the prefers-reduced-motion media feature', () => {
		renderHook(() => useReduceMotion());
		expect(window.matchMedia).toHaveBeenCalledWith(REDUCE_MOTION_QUERY);
	});

	it('updates when the preference changes', () => {
		const { result } = renderHook(() => useReduceMotion());
		expect(result.current).toBe(false);
		act(() => {
			getOrCreateMql(REDUCE_MOTION_QUERY).dispatchEvent(true);
		});
		expect(result.current).toBe(true);
		act(() => {
			getOrCreateMql(REDUCE_MOTION_QUERY).dispatchEvent(false);
		});
		expect(result.current).toBe(false);
	});

	it('removes its listener on unmount', () => {
		const { unmount } = renderHook(() => useReduceMotion());
		const mql = getOrCreateMql(REDUCE_MOTION_QUERY);
		expect(mql.listeners.size).toBe(1);
		unmount();
		expect(mql.listeners.size).toBe(0);
	});
});
