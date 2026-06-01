import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Skeleton } from './Skeleton';

describe('Skeleton — screen reader semantics', () => {
	it('exposes a busy live status announcing that content is loading', () => {
		render(<Skeleton />);
		// SR hears the polite status named "Loading" (via aria-label) and sees aria-busy so it can wait.
		const status = expectExposedAs('status', 'Loading');
		expect(status).toHaveAttribute('aria-busy', 'true');
		expect(status).toHaveAttribute('aria-live', 'polite');
	});

	it('lets the consumer override the announced loading label', () => {
		render(<Skeleton aria-label='Loading profile' />);
		expectExposedAs('status', 'Loading profile');
	});

	it('drops the status entirely once real content replaces the placeholder', () => {
		render(
			<Skeleton loading={false}>
				<p>Loaded content</p>
			</Skeleton>,
		);
		// No lingering busy region; the SR reads only the real content.
		expect(screen.queryByRole('status')).toBeNull();
		expect(screen.getByText('Loaded content')).toBeInTheDocument();
	});
});
