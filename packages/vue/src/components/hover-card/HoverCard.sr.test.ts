import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { HoverCard } from '.';

function renderCard(rootProps: Record<string, unknown> = {}) {
	render({
		setup() {
			return () =>
				h(HoverCard.Root, { openDelay: 100, closeDelay: 100, ...rootProps }, () => [
					h(HoverCard.Trigger, { 'data-testid': 'trigger' }, () => '@wire'),
					h(HoverCard.Content, { 'data-testid': 'content' }, () => 'Profile card'),
				]);
		},
	});
	return screen.getByTestId('trigger');
}

describe('HoverCard — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('exposes the content with role="dialog" when open', () => {
		renderCard({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('exposes dialog content that is reachable by role', () => {
		renderCard({ defaultOpen: true });
		expectExposedAs('dialog');
	});

	it('does not expose a dialog when closed initially', () => {
		renderCard();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('is keyboard reachable: opens immediately on focus and closes on blur', async () => {
		const trigger = renderCard();
		expect(screen.queryByRole('dialog')).toBeNull();
		await fireEvent.focus(trigger);
		// Focus opens it immediately (no delay), so it is not hover-only.
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await fireEvent.blur(trigger);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('does not close the dialog while the cursor is inside the content panel', async () => {
		const trigger = renderCard();
		await fireEvent.mouseEnter(trigger);
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		const content = screen.getByRole('dialog');
		await fireEvent.mouseLeave(trigger);
		await fireEvent.mouseEnter(content);
		vi.advanceTimersByTime(200);
		await Promise.resolve();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('marks the content panel with data-state="open" when visible', async () => {
		const trigger = renderCard();
		await fireEvent.focus(trigger);
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('data-state', 'open');
	});

	it('marks the content panel with data-state="closed" when forceMount and hidden', () => {
		render({
			setup() {
				return () =>
					h(HoverCard.Root, null, () => [
						h(HoverCard.Trigger, null, () => 'x'),
						h(HoverCard.Content, { forceMount: true, 'data-testid': 'content' }, () => 'hi'),
					]);
			},
		});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'closed');
		// The element is present in the DOM but hidden from AT via the hidden attribute.
		expect(content).toHaveAttribute('hidden');
	});
});