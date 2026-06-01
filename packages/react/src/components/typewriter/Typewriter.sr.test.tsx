import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { liveRegionText } from '@/test/sr';
import { Typewriter } from './Typewriter';

describe('Typewriter — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not spam the screen reader: the animated text is NOT a live region', () => {
		const { container } = render(
			<Typewriter.Root
				text='Hello world'
				speed={10}
			/>,
		);
		// No role=status/alert/log and no aria-live, so each revealed token is not
		// re-announced — the SR is not flooded character-by-character.
		expect(container.querySelector('[aria-live]')).toBeNull();
		expect(container.querySelector('[role="status"], [role="alert"], [role="log"]')).toBeNull();
		act(() => void vi.advanceTimersByTime(50));
		expect(liveRegionText(container)).toBe('');
	});

	it('marks itself busy while revealing and clears busy when done', () => {
		const { container } = render(
			<Typewriter.Root
				text='hi'
				speed={10}
			/>,
		);
		const root = container.firstElementChild!;
		// aria-busy tells the SR the region is mid-update; pair with the eventual
		// settled text so a single, complete announcement is possible.
		expect(root).toHaveAttribute('aria-busy', 'true');
		act(() => void vi.advanceTimersByTime(100));
		expect(root).not.toHaveAttribute('aria-busy');
	});

	it('settles to the full text in the DOM for the SR to read once complete', () => {
		const { container } = render(
			<Typewriter.Root
				text='Streaming complete'
				speed={5}
			/>,
		);
		act(() => void vi.advanceTimersByTime(500));
		// The whole string is present and no longer busy: the readable end state.
		expect(container.textContent).toBe('Streaming complete');
		expect(container.firstElementChild).not.toHaveAttribute('aria-busy');
	});

	it('hides the blinking cursor from assistive tech', () => {
		const { container } = render(
			<Typewriter.Root
				text='hi'
				speed={10}>
				<Typewriter.Text />
				<Typewriter.Cursor keepMounted>|</Typewriter.Cursor>
			</Typewriter.Root>,
		);
		// The cursor is decoration; it must never be read as a "|" character.
		const cursor = container.querySelector('[aria-hidden="true"]');
		expect(cursor).not.toBeNull();
		expect(cursor).toHaveTextContent('|');
	});
});
