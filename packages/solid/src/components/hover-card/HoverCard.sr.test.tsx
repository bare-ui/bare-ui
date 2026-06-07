/**
 * Screen-reader semantics for HoverCard. The content exposes role="dialog" when
 * open, and the trigger is keyboard reachable: focus opens it immediately (not
 * hover-only) and blur closes it, so SR/keyboard users can reach the content.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import { HoverCard } from './HoverCard';

describe('HoverCard — screen reader semantics', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('exposes the content with role="dialog" when open', () => {
		render(() => (
			<HoverCard.Root
				openDelay={100}
				closeDelay={100}
				defaultOpen>
				<HoverCard.Trigger data-testid='trigger'>@wire</HoverCard.Trigger>
				<HoverCard.Content data-testid='content'>Profile card</HoverCard.Content>
			</HoverCard.Root>
		));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('is keyboard reachable: opens immediately on focus and closes on blur', () => {
		render(() => (
			<HoverCard.Root
				openDelay={100}
				closeDelay={100}>
				<HoverCard.Trigger data-testid='trigger'>@wire</HoverCard.Trigger>
				<HoverCard.Content data-testid='content'>Profile card</HoverCard.Content>
			</HoverCard.Root>
		));
		const trigger = screen.getByTestId('trigger');
		expect(screen.queryByRole('dialog')).toBeNull();
		fireEvent.focus(trigger);
		// Focus opens it immediately (no delay), so it is not hover-only.
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		fireEvent.blur(trigger);
		expect(screen.queryByRole('dialog')).toBeNull();
	});
});
