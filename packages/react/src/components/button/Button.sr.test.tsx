import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { expectExposedAs } from '@/test/sr';

describe('Button — screen reader semantics', () => {
	it('is exposed as a button named by its text content', () => {
		render(<Button>Save</Button>);
		expectExposedAs('button', 'Save');
	});

	it('takes its accessible name from aria-label for an icon-only button', () => {
		render(
			<Button aria-label='Close'>
				<span aria-hidden='true'>×</span>
			</Button>,
		);
		expectExposedAs('button', 'Close');
	});

	it('prefers aria-label over visible text for the accessible name', () => {
		render(<Button aria-label='Add to cart'>Add</Button>);
		expectExposedAs('button', 'Add to cart');
		expect(screen.queryByRole('button', { name: 'Add' })).toBeNull();
	});

	it('exposes a disabled button as disabled to assistive tech', () => {
		render(<Button disabled>Save</Button>);
		expect(expectExposedAs('button', 'Save')).toBeDisabled();
	});

	it('exposes aria-pressed as a toggle button and reflects updates', () => {
		const { rerender } = render(<Button aria-pressed={false}>Mute</Button>);
		expect(expectExposedAs('button', 'Mute', { pressed: false })).toBeInTheDocument();
		rerender(<Button aria-pressed={true}>Mute</Button>);
		expect(expectExposedAs('button', 'Mute', { pressed: true })).toBeInTheDocument();
	});

	it('exposes aria-expanded for a disclosure button', () => {
		render(
			<Button
				aria-expanded={false}
				aria-controls='menu'>
				Menu
			</Button>,
		);
		const btn = screen.getByRole('button', { name: 'Menu', expanded: false });
		expect(btn).toHaveAttribute('aria-controls', 'menu');
	});

	it('forwards its accessible name and pressed state onto the child when asChild', () => {
		const { rerender } = render(
			<Button
				asChild
				aria-pressed={false}>
				<a href='/like'>Like</a>
			</Button>,
		);
		const link = screen.getByRole('link', { name: 'Like' });
		expect(link).toHaveAttribute('aria-pressed', 'false');
		rerender(
			<Button
				asChild
				aria-pressed={true}>
				<a href='/like'>Like</a>
			</Button>,
		);
		expect(screen.getByRole('link', { name: 'Like' })).toHaveAttribute('aria-pressed', 'true');
	});
});
