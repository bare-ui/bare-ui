import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
	it('renders as a <div>', () => {
		const { container } = render(<Divider />);
		expect(container.firstChild?.nodeName).toBe('DIV');
	});

	it('default orientation is horizontal', () => {
		const { container } = render(<Divider />);
		expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('sets data-orientation="vertical" when orientation="vertical"', () => {
		const { container } = render(<Divider orientation='vertical' />);
		expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
	});

	it('decorative divider has role="none" and aria-hidden', () => {
		const { container } = render(<Divider decorative />);
		expect(container.firstChild).toHaveAttribute('role', 'none');
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('semantic divider has role="separator"', () => {
		render(<Divider decorative={false} />);
		expect(screen.getByRole('separator')).toBeInTheDocument();
	});

	it('semantic divider has aria-orientation', () => {
		render(
			<Divider
				decorative={false}
				orientation='vertical'
			/>,
		);
		const sep = screen.getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('applies className', () => {
		const { container } = render(<Divider className='my-divider' />);
		expect(container.firstChild).toHaveClass('my-divider');
	});
});
