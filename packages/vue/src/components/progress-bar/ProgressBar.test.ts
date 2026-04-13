import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ProgressBar } from '.';

describe('ProgressBar', () => {
	it('renders with role="progressbar"', () => {
		render(ProgressBar);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('sets aria-valuenow to percentage', () => {
		render(ProgressBar, { props: { percentage: 50 } });
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
	});

	it('sets aria-valuemin=0 and aria-valuemax=100', () => {
		render(ProgressBar, { props: { percentage: 50 } });
		const bar = screen.getByRole('progressbar');
		expect(bar).toHaveAttribute('aria-valuemin', '0');
		expect(bar).toHaveAttribute('aria-valuemax', '100');
	});

	it('clamps percentage above 100 to 100', () => {
		render(ProgressBar, { props: { percentage: 150 } });
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
	});

	it('clamps percentage below 0 to 0', () => {
		render(ProgressBar, { props: { percentage: -10 } });
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('sets data-size attribute', () => {
		render(ProgressBar, { props: { size: 'large' } });
		expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'large');
	});

	it('renders a fill child with correct width', () => {
		const { container } = render(ProgressBar, { props: { percentage: 75 } });
		const fill = container.querySelector('[data-part="fill"]');
		expect(fill).toHaveStyle({ width: '75%' });
	});
});
