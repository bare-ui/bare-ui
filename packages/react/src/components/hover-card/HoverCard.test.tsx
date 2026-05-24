import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HoverCard } from './HoverCard';

function renderCard(props: Partial<React.ComponentProps<typeof HoverCard.Root>> = {}) {
	render(
		<HoverCard.Root
			openDelay={100}
			closeDelay={100}
			{...props}>
			<HoverCard.Trigger data-testid='trigger'>@wire</HoverCard.Trigger>
			<HoverCard.Content>Profile card</HoverCard.Content>
		</HoverCard.Root>,
	);
	return screen.getByTestId('trigger');
}

describe('HoverCard', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('is closed initially', () => {
		renderCard();
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('opens after the open delay on hover', () => {
		const trigger = renderCard();
		fireEvent.mouseEnter(trigger);
		expect(screen.queryByText('Profile card')).toBeNull();
		act(() => void vi.advanceTimersByTime(100));
		expect(screen.getByText('Profile card')).toBeInTheDocument();
	});

	it('closes after the close delay on leave', () => {
		const trigger = renderCard();
		fireEvent.mouseEnter(trigger);
		act(() => void vi.advanceTimersByTime(100));
		fireEvent.mouseLeave(trigger);
		expect(screen.getByText('Profile card')).toBeInTheDocument();
		act(() => void vi.advanceTimersByTime(100));
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('stays open when moving from trigger into the content', () => {
		const trigger = renderCard();
		fireEvent.mouseEnter(trigger);
		act(() => void vi.advanceTimersByTime(100));
		fireEvent.mouseLeave(trigger);
		// enter the content before the close delay elapses
		fireEvent.mouseEnter(screen.getByText('Profile card'));
		act(() => void vi.advanceTimersByTime(200));
		expect(screen.getByText('Profile card')).toBeInTheDocument();
	});

	it('opens immediately on focus and closes on blur', () => {
		const trigger = renderCard();
		fireEvent.focus(trigger);
		expect(screen.getByText('Profile card')).toBeInTheDocument();
		fireEvent.blur(trigger);
		expect(screen.queryByText('Profile card')).toBeNull();
	});

	it('sets data-state and data-side on the content', () => {
		render(
			<HoverCard.Root defaultOpen>
				<HoverCard.Trigger>x</HoverCard.Trigger>
				<HoverCard.Content
					side='top'
					data-testid='content'>
					hi
				</HoverCard.Content>
			</HoverCard.Root>,
		);
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
		expect(content).toHaveAttribute('data-side', 'top');
	});

	it('keeps content mounted with forceMount when closed', () => {
		render(
			<HoverCard.Root>
				<HoverCard.Trigger>x</HoverCard.Trigger>
				<HoverCard.Content
					forceMount
					data-testid='content'>
					hi
				</HoverCard.Content>
			</HoverCard.Root>,
		);
		const content = screen.getByTestId('content');
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute('hidden');
		expect(content).toHaveAttribute('data-state', 'closed');
	});

	it('throws when Trigger is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<HoverCard.Trigger>x</HoverCard.Trigger>)).toThrow(/HoverCard.Root/);
		spy.mockRestore();
	});
});
