import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { HoverCard } from '.';

function renderCard(rootProps: Record<string, unknown> = {}) {
	render({
		setup() {
			return () =>
				h(HoverCard.Root, { openDelay: 100, closeDelay: 100, ...rootProps }, () => [
					h(HoverCard.Trigger, { 'data-testid': 'trigger' }, () => '@wire'),
					h(HoverCard.Content, null, () => 'Profile card'),
				]);
		},
	});
	return screen.getByTestId('trigger');
}

describe('HoverCard', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('is closed initially', () => {
		renderCard();
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('opens after the open delay on hover', async () => {
		const trigger = renderCard();
		await fireEvent.mouseEnter(trigger);
		expect(screen.queryByText('Profile card')).toBeNull();
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		expect(screen.getByText('Profile card')).toBeInTheDocument();
	});

	it('closes after the close delay on leave', async () => {
		const trigger = renderCard();
		await fireEvent.mouseEnter(trigger);
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		await fireEvent.mouseLeave(trigger);
		expect(screen.getByText('Profile card')).toBeInTheDocument();
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('stays open when moving from trigger into the content', async () => {
		const trigger = renderCard();
		await fireEvent.mouseEnter(trigger);
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		await fireEvent.mouseLeave(trigger);
		// enter the content before the close delay elapses
		await fireEvent.mouseEnter(screen.getByText('Profile card'));
		vi.advanceTimersByTime(200);
		await Promise.resolve();
		expect(screen.getByText('Profile card')).toBeInTheDocument();
	});

	it('opens immediately on focus and closes on blur', async () => {
		const trigger = renderCard();
		await fireEvent.focus(trigger);
		expect(screen.getByText('Profile card')).toBeInTheDocument();
		await fireEvent.blur(trigger);
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('sets data-state and data-side on the content', () => {
		render({
			setup() {
				return () =>
					h(HoverCard.Root, { defaultOpen: true }, () => [
						h(HoverCard.Trigger, null, () => 'x'),
						h(HoverCard.Content, { side: 'top', 'data-testid': 'content' }, () => 'hi'),
					]);
			},
		});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
		expect(content).toHaveAttribute('data-side', 'top');
	});

	it('keeps content mounted with forceMount when closed', () => {
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
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute('hidden');
		expect(content).toHaveAttribute('data-state', 'closed');
	});

	it('throws when Trigger is used outside Root', () => {
		const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(HoverCard.Trigger, null, () => 'x');
				},
			}),
		).toThrow(/HoverCard.Root/);
		spy.mockRestore();
		errSpy.mockRestore();
	});
});
