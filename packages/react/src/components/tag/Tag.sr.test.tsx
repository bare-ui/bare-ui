/**
 * Screen-reader semantics for Tag. The label text must be readable, and the
 * remove control must be exposed as a button with a clear, self-describing name
 * (defaulting to "Remove") so SR users know what activating it does.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Tag } from './Tag';

describe('Tag — screen reader semantics', () => {
	it('exposes the label as readable text', () => {
		render(
			<Tag.Root>
				<Tag.Label>React</Tag.Label>
			</Tag.Root>,
		);
		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('exposes the remove control as a button named "Remove" by default', () => {
		render(
			<Tag.Root>
				<Tag.Label>React</Tag.Label>
				<Tag.Remove>×</Tag.Remove>
			</Tag.Root>,
		);
		// The decorative "×" glyph does not leak; SR announces "Remove, button".
		expectExposedAs('button', 'Remove');
	});

	it('lets the consumer name the remove control for the specific tag', () => {
		render(
			<Tag.Root>
				<Tag.Label>React</Tag.Label>
				<Tag.Remove aria-label='Remove React'>×</Tag.Remove>
			</Tag.Root>,
		);
		// A specific name ("Remove React") makes a list of tags unambiguous.
		expectExposedAs('button', 'Remove React');
	});
});
