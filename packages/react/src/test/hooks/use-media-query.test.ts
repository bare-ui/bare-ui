import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/use-media-query';

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

describe('useMediaQuery', () => {
	beforeEach(() => {
		registry.clear();
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			configurable: true,
			value: vi.fn((query: string) => getOrCreateMql(query)),
		});
	});

	it('returns false initially when query does not match', () => {
		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'));
		expect(result.current).toBe(false);
	});

	it('returns true initially when query already matches', () => {
		const mql = getOrCreateMql('(min-width: 800px)');
		mql.matches = true;
		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'));
		expect(result.current).toBe(true);
	});

	it('updates when the media query changes', () => {
		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'));
		expect(result.current).toBe(false);
		act(() => {
			getOrCreateMql('(min-width: 800px)').dispatchEvent(true);
		});
		expect(result.current).toBe(true);
		act(() => {
			getOrCreateMql('(min-width: 800px)').dispatchEvent(false);
		});
		expect(result.current).toBe(false);
	});

	it('removes the change listener on unmount', () => {
		const { unmount } = renderHook(() => useMediaQuery('(min-width: 800px)'));
		const mql = getOrCreateMql('(min-width: 800px)');
		expect(mql.listeners.size).toBe(1);
		unmount();
		expect(mql.listeners.size).toBe(0);
	});

	it('tracks distinct queries independently', () => {
		const { result: mobile } = renderHook(() => useMediaQuery('(max-width: 640px)'));
		const { result: desktop } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
		expect(mobile.current).toBe(false);
		expect(desktop.current).toBe(false);
		act(() => {
			getOrCreateMql('(max-width: 640px)').dispatchEvent(true);
		});
		expect(mobile.current).toBe(true);
		expect(desktop.current).toBe(false);
	});

	it('returns false when window.matchMedia is unavailable', () => {
		// @ts-expect-error simulate environment without matchMedia
		window.matchMedia = undefined;
		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'));
		expect(result.current).toBe(false);
	});
});
