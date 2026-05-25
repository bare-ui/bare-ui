import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, ref } from 'vue';
import { Typewriter } from '.';

describe('Typewriter', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('reveals text token-by-token over time', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'Hi', speed: 10 }),
		});
		expect(container.textContent).toBe('');

		await vi.advanceTimersByTimeAsync(0);
		expect(container.textContent).toBe('H');

		await vi.advanceTimersByTimeAsync(10);
		expect(container.textContent).toBe('Hi');
	});

	it('stays empty when autoStart is false', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'Hello', autoStart: false }),
		});
		await vi.advanceTimersByTimeAsync(1000);
		expect(container.textContent).toBe('');
	});

	it('respects startDelay before the first token', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'Yo', speed: 50, startDelay: 100 }),
		});
		await vi.advanceTimersByTimeAsync(50);
		expect(container.textContent).toBe('');
		await vi.advanceTimersByTimeAsync(60);
		expect(container.textContent).toBe('Y');
	});

	it('reveals word-by-word in word mode', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'one two three', mode: 'word', speed: 10 }),
		});
		await vi.advanceTimersByTimeAsync(0);
		expect(container.textContent).toBe('one ');
		await vi.advanceTimersByTimeAsync(10);
		expect(container.textContent).toBe('one two ');
	});

	it('fires onComplete once when fully revealed', async () => {
		const onComplete = vi.fn();
		render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'ok', speed: 5, onComplete }),
		});
		await vi.advanceTimersByTimeAsync(100);
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('continues from where it left off when text grows (streaming)', async () => {
		const textRef = ref('ab');
		const { container } = render({
			setup() {
				return () => h(Typewriter.Root, { text: textRef.value, speed: 10 });
			},
		});
		await vi.advanceTimersByTimeAsync(100);
		expect(container.textContent).toBe('ab');

		textRef.value = 'abcd';
		await vi.advanceTimersByTimeAsync(0);
		expect(container.textContent).toBe('abc');
		await vi.advanceTimersByTimeAsync(10);
		expect(container.textContent).toBe('abcd');
	});

	it('exposes typing state to a scoped slot', async () => {
		const { container } = render({
			setup: () => () =>
				h(
					Typewriter.Root,
					{ text: 'hi', speed: 10 },
					{
						default: ({ displayed, isTyping }: { displayed: string; isTyping: boolean }) =>
							h('span', { 'data-testid': 'out' }, `${displayed}${isTyping ? '|' : ''}`),
					},
				),
		});
		await vi.advanceTimersByTimeAsync(0);
		// After first tick (0 ms start delay): one char revealed + cursor
		const el = container.querySelector('[data-testid="out"]') as HTMLElement;
		expect(el?.textContent).toBe('h|');
		await vi.advanceTimersByTimeAsync(10);
		expect(el?.textContent).toBe('hi');
	});

	it('Cursor unmounts when done unless keepMounted', async () => {
		const { unmount } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'a', speed: 5 }, () => [
					h(Typewriter.Text),
					h(Typewriter.Cursor, { 'data-testid': 'cursor' }, () => '|'),
				]),
		});
		expect(screen.getByTestId('cursor')).toBeInTheDocument();
		await vi.advanceTimersByTimeAsync(100);
		expect(screen.queryByTestId('cursor')).toBeNull();
		unmount();

		render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'a', speed: 5 }, () => [
					h(Typewriter.Text),
					h(Typewriter.Cursor, { keepMounted: true, 'data-testid': 'cursor' }, () => '|'),
				]),
		});
		await vi.advanceTimersByTimeAsync(100);
		expect(screen.getByTestId('cursor')).toBeInTheDocument();
	});

	it('sets data-state and aria-busy during typing', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'hello', speed: 10 }),
		});
		const root = container.firstElementChild!;
		expect(root).toHaveAttribute('data-state', 'typing');
		expect(root).toHaveAttribute('aria-busy', 'true');
		await vi.advanceTimersByTimeAsync(200);
		expect(root).toHaveAttribute('data-state', 'done');
		expect(root).not.toHaveAttribute('aria-busy');
	});

	it('forwards class to each part via attribute fallthrough', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'hi', speed: 10, class: 'root-cls' }, () => [
					h(Typewriter.Text, { class: 'text-cls' }),
					h(Typewriter.Cursor, { keepMounted: true, class: 'cursor-cls' }, () => '|'),
				]),
		});
		await vi.advanceTimersByTimeAsync(0);
		expect(container.querySelector('.root-cls')).not.toBeNull();
		expect(container.querySelector('.text-cls')).not.toBeNull();
		expect(container.querySelector('.cursor-cls')).not.toBeNull();
	});

	it('throws when Text is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({ setup: () => () => h(Typewriter.Text) }),
		).toThrow(/Typewriter.Root/);
		spy.mockRestore();
	});
});
