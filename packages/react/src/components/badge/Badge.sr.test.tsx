import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Badge } from './Badge';

describe('Badge — screen reader semantics', () => {
	it('exposes the count text so the value is announced', () => {
		render(<Badge count={5} />);
		// The bare count "5" is read inline by a SR as part of its host control.
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('caps the announced count at "9+" for overflow', () => {
		render(<Badge count={42} />);
		expect(screen.getByText('9+')).toBeInTheDocument();
	});

	it('exposes a descriptive accessible name when given aria-label', () => {
		// A bare "3" is ambiguous; consumers can supply meaning via aria-label.
		render(
			<Badge
				count={3}
				role='status'
				aria-label='3 unread notifications'
			/>,
		);
		expectExposedAs('status', '3 unread notifications');
	});

	it('can be hidden from the a11y tree when purely decorative', () => {
		// When the count is conveyed elsewhere, the badge may be aria-hidden.
		render(
			<Badge
				count={3}
				aria-hidden='true'
				data-testid='badge'
			/>,
		);
		expect(screen.getByTestId('badge')).toHaveAttribute('aria-hidden', 'true');
	});
});
