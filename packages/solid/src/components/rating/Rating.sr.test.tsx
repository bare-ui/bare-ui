import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Rating } from './Rating';
import { expectExposedAs } from '@/test/sr';

describe('Rating — screen reader semantics', () => {
	it('interactive: is exposed as a named group of value-labelled star buttons', () => {
		render(() => <Rating max={5} />);
		const group = expectExposedAs('group', 'Rating');
		expect(group).toBeInTheDocument();
		// Each star is a button naming its own value within the scale.
		expect(expectExposedAs('button', '1 out of 5 stars')).toBeInTheDocument();
		expect(expectExposedAs('button', '5 out of 5 stars')).toBeInTheDocument();
	});

	it('interactive: reflects the selected value as pressed state on stars', async () => {
		render(() => <Rating max={5} />);
		await userEvent.click(expectExposedAs('button', '3 out of 5 stars'));
		const stars = screen.getAllByRole('button');
		// data-filled is the SR-irrelevant style hook; the selected value is what a
		// sighted user perceives. Stars up to 3 are filled, the rest are not.
		expect(stars[0]).toHaveAttribute('data-filled', '');
		expect(stars[2]).toHaveAttribute('data-filled', '');
		expect(stars[3]).not.toHaveAttribute('data-filled');
	});

	it('readOnly: is exposed as an image whose name announces the current rating', () => {
		render(() => (
			<Rating
				readOnly
				value={4}
				max={5}
			/>
		));
		const img = expectExposedAs('img', 'Rating: 4 out of 5');
		expect(img).toBeInTheDocument();
	});

	it('readOnly: the static rating name tracks the value', () => {
		render(() => (
			<Rating
				readOnly
				value={2}
				max={5}
			/>
		));
		expect(expectExposedAs('img', 'Rating: 2 out of 5')).toBeInTheDocument();
	});

	it('readOnly: star buttons are removed from the tab order', () => {
		render(() => (
			<Rating
				readOnly
				value={3}
				max={5}
			/>
		));
		screen.getAllByRole('button').forEach((star) => {
			expect(star).toHaveAttribute('tabindex', '-1');
			expect(star).toBeDisabled();
		});
	});
});
