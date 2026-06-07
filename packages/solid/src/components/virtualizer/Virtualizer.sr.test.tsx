import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { Virtualizer } from './Virtualizer';

describe('Virtualizer — screen reader semantics', () => {
	it('exposes a keyboard-operable scroll container', () => {
		const { container } = render(() => (
			<Virtualizer.Root
				count={500}
				estimateSize={40}>
				{({ index }) => <div>{`row ${index}`}</div>}
			</Virtualizer.Root>
		));
		// Keyboard-only users must be able to focus and scroll the viewport.
		expect(container.firstElementChild).toHaveAttribute('tabindex', '0');
	});

	it('is headless: adds no list/grid role on its own — consumers supply the collection semantics', () => {
		render(() => (
			<Virtualizer.Root
				count={100}
				estimateSize={40}
				data-testid='vroot'>
				{({ index }) => <div>{index}</div>}
			</Virtualizer.Root>
		));
		const root = screen.getByTestId('vroot');
		// The component does not invent a role; it would be wrong to claim "list" while
		// most rows are unmounted. Semantics are the consumer's responsibility.
		expect(root).not.toHaveAttribute('role');
		expect(root).not.toHaveAttribute('aria-hidden');
	});

	it('exposes consumer-supplied collection roles to the a11y tree', () => {
		// When the consumer opts into a listbox + options, those roles are passed through.
		render(() => (
			<Virtualizer.Root
				count={50}
				estimateSize={40}
				role='listbox'
				aria-label='Cities'>
				{({ index }) => <div role='option'>{`City ${index}`}</div>}
			</Virtualizer.Root>
		));
		const listbox = expectExposedAs('listbox', 'Cities');
		// SR caveat: only the rendered window of options is in the DOM/a11y tree — the
		// far-offscreen rows are not announceable until scrolled into view.
		expect(within(listbox).getAllByRole('option').length).toBeGreaterThan(0);
	});
});
