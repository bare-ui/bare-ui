import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HoverCard } from './HoverCard';

function HoverCardHarness(props: Partial<React.ComponentProps<typeof HoverCard.Root>> = {}) {
	return (
		<HoverCard.Root
			openDelay={100}
			closeDelay={100}
			{...props}>
			<HoverCard.Trigger data-testid='trigger'>@wire</HoverCard.Trigger>
			<HoverCard.Content data-testid='content'>Profile card</HoverCard.Content>
		</HoverCard.Root>
	);
}

describe('HoverCard — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('exposes the content with role="dialog" when open', () => {
		render(<HoverCardHarness defaultOpen />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('is keyboard reachable: opens immediately on focus and closes on blur', () => {
		render(<HoverCardHarness />);
		const trigger = screen.getByTestId('trigger');
		expect(screen.queryByRole('dialog')).toBeNull();
		fireEvent.focus(trigger);
		// Focus opens it immediately (no delay), so it is not hover-only.
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		fireEvent.blur(trigger);
		act(() => void vi.advanceTimersByTime(0));
		expect(screen.queryByRole('dialog')).toBeNull();
	});
});
