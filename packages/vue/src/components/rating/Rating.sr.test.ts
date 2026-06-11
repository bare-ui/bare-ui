import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Rating } from '.';

function renderRating(props: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () => h(Rating, { ...props });
		},
	});
}

describe('Rating — screen reader semantics', () => {
	it('interactive: is exposed as a named group of value-labelled star buttons', () => {
		renderRating({ max: 5 });
		const group = expectExposedAs('group', 'Rating');
		expect(group).toBeInTheDocument();
		expect(expectExposedAs('button', '1 out of 5 stars')).toBeInTheDocument();
		expect(expectExposedAs('button', '5 out of 5 stars')).toBeInTheDocument();
	});

	it('interactive: reflects the selected value as filled state on stars', async () => {
		renderRating({ max: 5 });
		await userEvent.click(expectExposedAs('button', '3 out of 5 stars'));
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-filled', '');
		expect(stars[2]).toHaveAttribute('data-filled', '');
		expect(stars[3]).not.toHaveAttribute('data-filled');
	});

	it('readOnly: is exposed as an image whose name announces the current rating', () => {
		renderRating({ readOnly: true, value: 4, max: 5 });
		const img = expectExposedAs('img', 'Rating: 4 out of 5');
		expect(img).toBeInTheDocument();
	});

	it('readOnly: the static rating name tracks the value', () => {
		renderRating({ readOnly: true, value: 2, max: 5 });
		expect(expectExposedAs('img', 'Rating: 2 out of 5')).toBeInTheDocument();
	});

	it('readOnly: star buttons are removed from the tab order', () => {
		renderRating({ readOnly: true, value: 3, max: 5 });
		screen.getAllByRole('button').forEach((star) => {
			expect(star).toHaveAttribute('tabindex', '-1');
			expect(star).toBeDisabled();
		});
	});
});