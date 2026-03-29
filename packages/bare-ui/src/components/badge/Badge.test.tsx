import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
	it('renders count of 0 as "0"', () => {
		render(<Badge count={0} />);
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it('renders exact count for 1-9', () => {
		render(<Badge count={5} />);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('renders "9+" for counts over 9', () => {
		render(<Badge count={10} />);
		expect(screen.getByText('9+')).toBeInTheDocument();
	});

	it('renders "9+" for large counts', () => {
		render(<Badge count={999} />);
		expect(screen.getByText('9+')).toBeInTheDocument();
	});

	it('renders "9" for count of exactly 9', () => {
		render(<Badge count={9} />);
		expect(screen.getByText('9')).toBeInTheDocument();
	});

	it('sets data-count to the raw count value', () => {
		const { container } = render(<Badge count={15} />);
		expect(container.firstChild).toHaveAttribute('data-count', '15');
	});

	it('applies className', () => {
		const { container } = render(
			<Badge
				count={3}
				className='my-badge'
			/>,
		);
		expect(container.firstChild).toHaveClass('my-badge');
	});

	it('renders as a <span>', () => {
		const { container } = render(<Badge count={1} />);
		expect(container.firstChild?.nodeName).toBe('SPAN');
	});
});
