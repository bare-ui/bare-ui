import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { AspectRatio } from '.';

describe('AspectRatio — screen reader semantics', () => {
	it('is transparent to the a11y tree — adds no role or name of its own', () => {
		render(AspectRatio, {
			props: { ratio: 16 / 9 },
			attrs: { 'data-testid': 'ar' },
			slots: {
				default: '<img src="photo.jpg" alt="Mountain view" />',
			},
		});
		const wrapper = screen.getByTestId('ar');
		// A pure layout wrapper must not invent semantics that a SR would announce.
		expect(wrapper).not.toHaveAttribute('role');
		expect(wrapper).not.toHaveAttribute('aria-label');
		expect(wrapper).not.toHaveAttribute('aria-hidden');
	});

	it('lets the inner content remain exposed with its own semantics', () => {
		render(AspectRatio, {
			props: { ratio: 1 },
			slots: {
				default: '<img src="photo.jpg" alt="Mountain view" />',
			},
		});
		// The framed image keeps its role and accessible name; the wrapper is invisible to AT.
		expectExposedAs('img', 'Mountain view');
	});
});
