import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Card } from '.';

describe('Card', () => {
	it('renders as a <div>', () => {
		const { container } = render(Card);
		expect(container.firstChild?.nodeName).toBe('DIV');
	});

	it('renders children', () => {
		const { getByText } = render(Card, { slots: { default: () => 'Hello' } });
		expect(getByText('Hello')).toBeInTheDocument();
	});

	it('sets data-color attribute', () => {
		const { container } = render(Card, { props: { color: 'primary' } });
		expect(container.firstChild).toHaveAttribute('data-color', 'primary');
	});

	it('sets data-size attribute', () => {
		const { container } = render(Card, { props: { size: 'large' } });
		expect(container.firstChild).toHaveAttribute('data-size', 'large');
	});

	it('applies className', () => {
		const { container } = render(Card, { attrs: { class: 'my-card' } });
		expect(container.firstChild).toHaveClass('my-card');
	});
});
