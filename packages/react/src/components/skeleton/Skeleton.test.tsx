import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
	it('renders a busy status when loading', () => {
		render(<Skeleton data-testid='skel' />);
		const el = screen.getByTestId('skel');
		expect(el).toHaveAttribute('aria-busy', 'true');
		expect(el).toHaveAttribute('data-loading', '');
	});

	it('renders children when loading=false', () => {
		render(
			<Skeleton loading={false}>
				<p>Real content</p>
			</Skeleton>,
		);
		expect(screen.getByText('Real content')).toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});
