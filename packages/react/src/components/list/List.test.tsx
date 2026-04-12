import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { List } from './List';

describe('List', () => {
	it('renders as <ul> by default', () => {
		const { container } = render(
			<List>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild?.nodeName).toBe('UL');
	});

	it('renders as <ol> when isOrdered=true', () => {
		const { container } = render(
			<List isOrdered>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild?.nodeName).toBe('OL');
	});

	it('renders children', () => {
		render(
			<List>
				<li>Alpha</li>
				<li>Beta</li>
			</List>,
		);
		expect(screen.getByText('Alpha')).toBeInTheDocument();
		expect(screen.getByText('Beta')).toBeInTheDocument();
	});

	it('sets data-type from type prop', () => {
		const { container } = render(
			<List type='divider'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).toHaveAttribute('data-type', 'divider');
	});

	it('sets data-striped when type="striped"', () => {
		const { container } = render(
			<List type='striped'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).toHaveAttribute('data-striped', '');
	});

	it('sets data-divider when type="divider"', () => {
		const { container } = render(
			<List type='divider'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).toHaveAttribute('data-divider', '');
	});

	it('does not set data-striped for non-striped types', () => {
		const { container } = render(
			<List type='divider'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).not.toHaveAttribute('data-striped');
	});

	it('sets data-size from size prop', () => {
		const { container } = render(
			<List size='small'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).toHaveAttribute('data-size', 'small');
	});

	it('applies className', () => {
		const { container } = render(
			<List className='my-list'>
				<li>Item</li>
			</List>,
		);
		expect(container.firstChild).toHaveClass('my-list');
	});
});
