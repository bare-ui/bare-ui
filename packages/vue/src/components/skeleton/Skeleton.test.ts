import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Skeleton } from '.';

describe('Skeleton', () => {
	it('renders a busy status when loading', () => {
		render(Skeleton, { attrs: { 'data-testid': 'skel' } });
		const el = screen.getByTestId('skel');
		expect(el).toHaveAttribute('aria-busy', 'true');
		expect(el).toHaveAttribute('data-loading', '');
	});

	it('renders children when loading=false', () => {
		render(Skeleton, {
			props: { loading: false },
			slots: { default: '<p>Real content</p>' },
		});
		expect(screen.getByText('Real content')).toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});
