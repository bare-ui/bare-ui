import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { liveRegionText } from '@/test/sr';
import { Typewriter } from '.';

describe('Typewriter — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not spam the screen reader: the animated text is NOT a live region', () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'Hello world', speed: 10 }),
		});
		// No role=status/alert/log and no aria-live, so each revealed token is not
		// re-announced — the SR is not flooded character-by-character.
		expect(container.querySelector('[aria-live]')).toBeNull();
		expect(container.querySelector('[role="status"], [role="alert"], [role="log"]')).toBeNull();
		vi.advanceTimersByTime(50);
		expect(liveRegionText(container as HTMLElement)).toBe('');
	});

	it('marks itself busy while revealing and clears busy when done', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'hi', speed: 10 }),
		});
		const root = container.firstElementChild as HTMLElement;
		// aria-busy tells the SR the region is mid-update; pair with the eventual
		// settled text so a single, complete announcement is possible.
		await nextTick();
		expect(root).toHaveAttribute('aria-busy', 'true');
		vi.advanceTimersByTime(100);
		await nextTick();
		expect(root).not.toHaveAttribute('aria-busy');
	});

	it('settles to the full text in the DOM for the SR to read once complete', async () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'Streaming complete', speed: 5 }),
		});
		vi.advanceTimersByTime(500);
		await nextTick();
		// The whole string is present and no longer busy: the readable end state.
		expect(container.textContent).toBe('Streaming complete');
		expect(container.firstElementChild).not.toHaveAttribute('aria-busy');
	});

	it('hides the blinking cursor from assistive tech', () => {
		const { container } = render({
			setup: () => () =>
				h(Typewriter.Root, { text: 'hi', speed: 10 }, () => [
					h(Typewriter.Text),
					h(Typewriter.Cursor, { keepMounted: true }, () => '|'),
				]),
		});
		// The cursor is decoration; it must never be read as a "|" character.
		const cursor = container.querySelector('[aria-hidden="true"]');
		expect(cursor).not.toBeNull();
		expect(cursor).toHaveTextContent('|');
	});
});
