import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
	it('renders with role="status" and aria-label="Loading"', () => {
		render(<Spinner />);
		expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
	});

	it('renders 12 dots', () => {
		const { container } = render(<Spinner />);
		const dots = container.querySelectorAll('[data-part="dot"]');
		expect(dots).toHaveLength(12);
	});

	it('default data-size is "medium"', () => {
		render(<Spinner />);
		expect(screen.getByRole('status')).toHaveAttribute('data-size', 'medium');
	});

	it('sets data-size from size prop', () => {
		render(<Spinner size='large' />);
		expect(screen.getByRole('status')).toHaveAttribute('data-size', 'large');
	});

	it('applies className', () => {
		render(<Spinner className='my-spinner' />);
		expect(screen.getByRole('status')).toHaveClass('my-spinner');
	});

	it('sets --spinner-color CSS variable when color prop is provided', () => {
		render(
			<Spinner
				color='red'
				data-testid='spinner'
			/>,
		);
		const el = screen.getByTestId('spinner');
		expect(el.style.getPropertyValue('--spinner-color')).toBe('red');
	});

	it('does not set --spinner-color when color is not provided', () => {
		render(<Spinner data-testid='spinner' />);
		const el = screen.getByTestId('spinner');
		expect(el.style.getPropertyValue('--spinner-color')).toBe('');
	});
});
