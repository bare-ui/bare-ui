import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useCopyToClipboard, type UseCopyToClipboardOptions, type UseCopyToClipboardResult } from '@/composables/use-copy-to-clipboard';

function mount(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
	let captured!: UseCopyToClipboardResult;
	const Harness = defineComponent({
		setup() {
			captured = useCopyToClipboard(options);
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useCopyToClipboard', () => {
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
		const { copied, value, error } = mount();
		expect(copied.value).toBe(false);
		expect(value.value).toBeNull();
		expect(error.value).toBeNull();
	});

	it('writes the text to the clipboard and marks copied', async () => {
		const { copy, copied, value } = mount({ resetAfter: 0 });
		const ok = await copy('hello');
		expect(ok).toBe(true);
		expect(writeText).toHaveBeenCalledWith('hello');
		expect(copied.value).toBe(true);
		expect(value.value).toBe('hello');
	});

	it('resets copied after the resetAfter delay', async () => {
		vi.useFakeTimers();
		const { copy, copied } = mount({ resetAfter: 100 });
		await copy('x');
		expect(copied.value).toBe(true);
		vi.advanceTimersByTime(100);
		expect(copied.value).toBe(false);
		vi.useRealTimers();
	});

	it('does not auto-reset when resetAfter is 0', async () => {
		vi.useFakeTimers();
		const { copy, copied } = mount({ resetAfter: 0 });
		await copy('x');
		vi.advanceTimersByTime(10000);
		expect(copied.value).toBe(true);
		vi.useRealTimers();
	});

	it('captures errors when writeText rejects', async () => {
		writeText.mockRejectedValueOnce(new Error('denied'));
		const { copy, copied, error } = mount();
		const ok = await copy('x');
		expect(ok).toBe(false);
		expect(copied.value).toBe(false);
		expect(error.value?.message).toBe('denied');
	});

	it('reset() returns to the initial state', async () => {
		const { copy, copied, value, error, reset } = mount({ resetAfter: 0 });
		await copy('x');
		reset();
		expect(copied.value).toBe(false);
		expect(value.value).toBeNull();
		expect(error.value).toBeNull();
	});
});
