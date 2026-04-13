import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import { List } from '.';

describe('List', () => {
	it('renders as <ul> by default', () => {
		const { container } = render(List);
		expect(container.firstChild?.nodeName).toBe('UL');
	});

	it('renders as <ol> when isOrdered', () => {
		const { container } = render(List, { props: { isOrdered: true } });
		expect(container.firstChild?.nodeName).toBe('OL');
	});

	it('renders children', () => {
		const { getByText } = render(List, {
			slots: { default: () => h('li', 'Item 1') },
		});
		expect(getByText('Item 1')).toBeInTheDocument();
	});

	it('sets data-type attribute', () => {
		const { container } = render(List, { props: { type: 'divider' } });
		expect(container.firstChild).toHaveAttribute('data-type', 'divider');
	});

	it('sets data-size attribute', () => {
		const { container } = render(List, { props: { size: 'large' } });
		expect(container.firstChild).toHaveAttribute('data-size', 'large');
	});

	it('sets data-striped for striped type', () => {
		const { container } = render(List, { props: { type: 'striped' } });
		expect(container.firstChild).toHaveAttribute('data-striped', '');
	});

	it('sets data-divider for divider type', () => {
		const { container } = render(List, { props: { type: 'divider' } });
		expect(container.firstChild).toHaveAttribute('data-divider', '');
	});

	it('applies className', () => {
		const { container } = render(List, { attrs: { class: 'my-list' } });
		expect(container.firstChild).toHaveClass('my-list');
	});
});
