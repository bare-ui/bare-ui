import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

describe('useCopyToClipboard', () => {
	let writeTextMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		writeTextMock = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, {
			clipboard: { writeText: writeTextMock },
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('returns initial state', () => {
		const { result } = renderHook(() => useCopyToClipboard());
		expect(result.current.value).toBeNull();
		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('copies text and sets copied=true on success', async () => {
		const { result } = renderHook(() => useCopyToClipboard());
		let ok: boolean | undefined;
		await act(async () => {
			ok = await result.current.copy('hello');
		});
		expect(ok).toBe(true);
		expect(writeTextMock).toHaveBeenCalledWith('hello');
		expect(result.current.value).toBe('hello');
		expect(result.current.copied).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('auto-resets copied after resetAfter ms', async () => {
		const { result } = renderHook(() => useCopyToClipboard({ resetAfter: 1000 }));
		await act(async () => {
			await result.current.copy('hi');
		});
		expect(result.current.copied).toBe(true);
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.copied).toBe(false);
		// `value` is retained until manual reset
		expect(result.current.value).toBe('hi');
	});

	it('does not auto-reset when resetAfter=0', async () => {
		const { result } = renderHook(() => useCopyToClipboard({ resetAfter: 0 }));
		await act(async () => {
			await result.current.copy('hi');
		});
		expect(result.current.copied).toBe(true);
		act(() => {
			vi.advanceTimersByTime(10_000);
		});
		expect(result.current.copied).toBe(true);
	});

	it('records error and returns false on clipboard failure', async () => {
		writeTextMock.mockRejectedValueOnce(new Error('denied'));
		const { result } = renderHook(() => useCopyToClipboard());
		let ok: boolean | undefined;
		await act(async () => {
			ok = await result.current.copy('x');
		});
		expect(ok).toBe(false);
		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe('denied');
	});

	it('reset clears value, copied, and error', async () => {
		const { result } = renderHook(() => useCopyToClipboard());
		await act(async () => {
			await result.current.copy('hello');
		});
		act(() => {
			result.current.reset();
		});
		expect(result.current.value).toBeNull();
		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('clears pending timer on unmount', async () => {
		const { result, unmount } = renderHook(() => useCopyToClipboard({ resetAfter: 1000 }));
		await act(async () => {
			await result.current.copy('bye');
		});
		const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
		unmount();
		expect(clearSpy).toHaveBeenCalled();
	});
});
