import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Tooltip } from '.';

const {
	Root: TooltipRoot,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
} = Tooltip;

function renderTooltip() {
	return render({
		template: `
			<TooltipRoot :delayDuration="0">
				<TooltipTrigger>
					<button>Save</button>
				</TooltipTrigger>
				<TooltipContent>Saves your changes</TooltipContent>
			</TooltipRoot>
		`,
		components: { TooltipRoot, TooltipTrigger, TooltipContent },
	});
}

describe('Tooltip — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('exposes the content with role="tooltip"', () => {
		renderTooltip();
		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('associates the trigger with the tooltip via aria-describedby after focus opens it', async () => {
		renderTooltip();
		const tooltip = screen.getByRole('tooltip');
		const trigger = screen.getByText('Save').closest('span')!;

		// Before focus: aria-describedby is not set (Vue sets it only when open)
		expect(trigger.getAttribute('aria-describedby')).toBeNull();

		// Focus opens the tooltip (delayDuration=0 → no delay)
		await fireEvent.focus(trigger);
		vi.advanceTimersByTime(0);

		// After open: trigger must point at the tooltip element
		expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
		expect(tooltip.id).toBeTruthy();
		expect(document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent).toBe(
			'Saves your changes',
		);
	});

	it('is keyboard reachable: appears on focus, not hover-only', async () => {
		renderTooltip();
		const content = screen.getByRole('tooltip');
		expect(content).toHaveAttribute('data-state', 'closed');

		const trigger = screen.getByText('Save').closest('span')!;

		// Focusing the trigger opens the tooltip (delayDuration=0 → no timer)
		await fireEvent.focus(trigger);
		vi.advanceTimersByTime(0);
		expect(content).toHaveAttribute('data-state', 'open');

		await fireEvent.blur(trigger);
		expect(content).toHaveAttribute('data-state', 'closed');
	});
});
