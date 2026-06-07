import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio — screen reader semantics', () => {
	it('is transparent to the a11y tree — adds no role or name of its own', () => {
		render(() => (
			<AspectRatio
				ratio={16 / 9}
				data-testid='ar'>
				<img
					src='photo.jpg'
					alt='Mountain view'
				/>
			</AspectRatio>
		));
		const wrapper = screen.getByTestId('ar');
		// A pure layout wrapper must not invent semantics that a SR would announce.
		expect(wrapper).not.toHaveAttribute('role');
		expect(wrapper).not.toHaveAttribute('aria-label');
		expect(wrapper).not.toHaveAttribute('aria-hidden');
	});

	it('lets the inner content remain exposed with its own semantics', () => {
		render(() => (
			<AspectRatio ratio={1}>
				<img
					src='photo.jpg'
					alt='Mountain view'
				/>
			</AspectRatio>
		));
		// The framed image keeps its role and accessible name; the wrapper is invisible to AT.
		expectExposedAs('img', 'Mountain view');
	});
});
