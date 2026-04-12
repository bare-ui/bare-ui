import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
	it('renders children', () => {
		render(<Card>Card content</Card>);
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('renders as a <div>', () => {
		const { container } = render(<Card>content</Card>);
		expect(container.firstChild?.nodeName).toBe('DIV');
	});

	it('sets data-color when color prop is provided', () => {
		const { container } = render(<Card color='blue'>content</Card>);
		expect(container.firstChild).toHaveAttribute('data-color', 'blue');
	});

	it('does not set data-color when color is not provided', () => {
		const { container } = render(<Card>content</Card>);
		expect(container.firstChild).not.toHaveAttribute('data-color');
	});

	it('sets data-size when size prop is provided', () => {
		const { container } = render(<Card size='large'>content</Card>);
		expect(container.firstChild).toHaveAttribute('data-size', 'large');
	});

	it('applies className', () => {
		const { container } = render(<Card className='my-card'>content</Card>);
		expect(container.firstChild).toHaveClass('my-card');
	});

	it('spreads additional HTML attributes', () => {
		render(<Card data-testid='my-card'>content</Card>);
		expect(screen.getByTestId('my-card')).toBeInTheDocument();
	});
});
