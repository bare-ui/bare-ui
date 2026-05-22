import { renderHook } from '@solidjs/testing-library';
import { createCopyToClipboard, type CreateCopyToClipboardOptions } from '@/primitives/create-copy-to-clipboard';

function mount(options: CreateCopyToClipboardOptions = {}) {
	return renderHook(() => createCopyToClipboard(options));
}

describe('createCopyToClipboard', () => {
	let writeText: ReturnType<typeof vi.fn>;
	const originalClipboard = (navigator as Navigator & { clipboard?: Clipboard }).clipboard;

	beforeEach(() => {
		writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText },
		});
	});

	afterEach(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: originalClipboard,
		});
	});

	it('starts with copied=false, value=null, error=null', () => {
		const { result, cleanup } = mount();
		expect(result.copied()).toBe(false);
		expect(result.value()).toBeNull();
		expect(result.error()).toBeNull();
		cleanup();
	});

	it('writes text to the clipboard and marks copied', async () => {
		const { result, cleanup } = mount({ resetAfter: 0 });
		const ok = await result.copy('hello');
		expect(ok).toBe(true);
		expect(writeText).toHaveBeenCalledWith('hello');
		expect(result.copied()).toBe(true);
		expect(result.value()).toBe('hello');
		cleanup();
	});

	it('resets copied after the resetAfter delay', async () => {
		vi.useFakeTimers();
		const { result, cleanup } = mount({ resetAfter: 100 });
		await result.copy('x');
		expect(result.copied()).toBe(true);
		vi.advanceTimersByTime(100);
		expect(result.copied()).toBe(false);
		vi.useRealTimers();
		cleanup();
	});

	it('does not auto-reset when resetAfter is 0', async () => {
		vi.useFakeTimers();
		const { result, cleanup } = mount({ resetAfter: 0 });
		await result.copy('x');
		vi.advanceTimersByTime(10000);
		expect(result.copied()).toBe(true);
		vi.useRealTimers();
		cleanup();
	});

	it('captures errors when writeText rejects', async () => {
		writeText.mockRejectedValueOnce(new Error('denied'));
		const { result, cleanup } = mount();
		const ok = await result.copy('x');
		expect(ok).toBe(false);
		expect(result.copied()).toBe(false);
		expect(result.error()?.message).toBe('denied');
		cleanup();
	});

	it('reset() returns to the initial state', async () => {
		const { result, cleanup } = mount({ resetAfter: 0 });
		await result.copy('x');
		result.reset();
		expect(result.copied()).toBe(false);
		expect(result.value()).toBeNull();
		expect(result.error()).toBeNull();
		cleanup();
	});
});
