import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

function TooltipHarness() {
	return (
		<Tooltip.Root delayDuration={0}>
			<Tooltip.Trigger>
				<button>Save</button>
			</Tooltip.Trigger>
			<Tooltip.Content>Saves your changes</Tooltip.Content>
		</Tooltip.Root>
	);
}

describe('Tooltip — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('exposes the content with role="tooltip"', () => {
		render(<TooltipHarness />);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('associates the trigger with the tooltip via aria-describedby', () => {
		render(<TooltipHarness />);
		const tooltip = screen.getByRole('tooltip');
		const trigger = screen.getByText('Save').closest('span')!;
		// The trigger's aria-describedby must resolve to the tooltip content, so a
		// screen reader reads the tooltip text as the trigger's description.
		expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
		expect(tooltip.id).toBeTruthy();
		expect(document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent).toBe(
			'Saves your changes',
		);
	});

	it('is keyboard reachable: appears on focus, not hover-only', () => {
		render(<TooltipHarness />);
		const content = screen.getByRole('tooltip');
		expect(content).toHaveAttribute('data-state', 'closed');
		const trigger = screen.getByText('Save').closest('span')!;
		// Focusing the trigger opens the tooltip (delayDuration=0 → 0ms timer), so it
		// is reachable by keyboard users and not gated behind a mouse hover.
		fireEvent.focus(trigger);
		act(() => void vi.advanceTimersByTime(0));
		expect(content).toHaveAttribute('data-state', 'open');
		fireEvent.blur(trigger);
		expect(content).toHaveAttribute('data-state', 'closed');
	});
});
