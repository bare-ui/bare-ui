import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
	it('renders with role="progressbar"', () => {
		render(<ProgressBar percentage={50} />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('sets aria-valuenow to the percentage', () => {
		render(<ProgressBar percentage={75} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
	});

	it('sets aria-valuemin=0 and aria-valuemax=100', () => {
		render(<ProgressBar percentage={50} />);
		const bar = screen.getByRole('progressbar');
		expect(bar).toHaveAttribute('aria-valuemin', '0');
		expect(bar).toHaveAttribute('aria-valuemax', '100');
	});

	it('clamps percentage to 0 if below 0', () => {
		render(<ProgressBar percentage={-10} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('clamps percentage to 100 if above 100', () => {
		render(<ProgressBar percentage={150} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
	});

	it('fill div width reflects clamped percentage', () => {
		const { container } = render(<ProgressBar percentage={60} />);
		const fill = container.querySelector('[data-part="fill"]') as HTMLElement;
		expect(fill.style.width).toBe('60%');
	});

	it('sets data-size from size prop', () => {
		render(
			<ProgressBar
				percentage={50}
				size='large'
			/>,
		);
		expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'large');
	});

	it('applies className', () => {
		render(
			<ProgressBar
				percentage={50}
				className='my-bar'
			/>,
		);
		expect(screen.getByRole('progressbar')).toHaveClass('my-bar');
	});
});
