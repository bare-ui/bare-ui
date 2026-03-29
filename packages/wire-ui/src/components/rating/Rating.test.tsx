import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from './Rating';

function renderRating(props: React.ComponentProps<typeof Rating> = {}) {
	return render(<Rating {...props} />);
}

describe('Rating', () => {
	it('renders 5 star buttons by default', () => {
		renderRating();
		expect(screen.getAllByRole('button')).toHaveLength(5);
	});

	it('renders max star buttons', () => {
		renderRating({ max: 3 });
		expect(screen.getAllByRole('button')).toHaveLength(3);
	});

	it('star buttons have accessible labels', () => {
		renderRating();
		expect(screen.getByRole('button', { name: '1 out of 5 stars' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '5 out of 5 stars' })).toBeInTheDocument();
	});

	it('defaultValue fills stars up to the default', () => {
		renderRating({ defaultValue: 3 });
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-filled', ''); // star 1
		expect(stars[1]).toHaveAttribute('data-filled', ''); // star 2
		expect(stars[2]).toHaveAttribute('data-filled', ''); // star 3
		expect(stars[3]).not.toHaveAttribute('data-filled'); // star 4
		expect(stars[4]).not.toHaveAttribute('data-filled'); // star 5
	});

	it('clicking a star selects it (uncontrolled)', async () => {
		renderRating();
		await userEvent.click(screen.getByRole('button', { name: '4 out of 5 stars' }));
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-filled', '');
		expect(stars[1]).toHaveAttribute('data-filled', '');
		expect(stars[2]).toHaveAttribute('data-filled', '');
		expect(stars[3]).toHaveAttribute('data-filled', '');
		expect(stars[4]).not.toHaveAttribute('data-filled');
	});

	it('onChange fires with star value when clicked', async () => {
		const handleChange = vi.fn();
		renderRating({ onChange: handleChange });
		await userEvent.click(screen.getByRole('button', { name: '3 out of 5 stars' }));
		expect(handleChange).toHaveBeenCalledWith(3);
	});

	it('controlled: value prop controls filled stars', () => {
		renderRating({ value: 2, onChange: vi.fn() });
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-filled', '');
		expect(stars[1]).toHaveAttribute('data-filled', '');
		expect(stars[2]).not.toHaveAttribute('data-filled');
	});

	it('hover highlights stars up to hovered star', async () => {
		renderRating();
		await userEvent.hover(screen.getByRole('button', { name: '3 out of 5 stars' }));
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-highlighted', '');
		expect(stars[1]).toHaveAttribute('data-highlighted', '');
		expect(stars[2]).toHaveAttribute('data-highlighted', '');
		expect(stars[3]).not.toHaveAttribute('data-highlighted');
	});

	it('hover clears on mouse leave', async () => {
		renderRating();
		const star3 = screen.getByRole('button', { name: '3 out of 5 stars' });
		await userEvent.hover(star3);
		await userEvent.unhover(star3);
		const stars = screen.getAllByRole('button');
		// No stars highlighted (unless there's a selected value, which there isn't)
		expect(stars[0]).not.toHaveAttribute('data-highlighted');
	});

	it('disabled: clicking does not change value', async () => {
		const handleChange = vi.fn();
		renderRating({ disabled: true, onChange: handleChange });
		await userEvent.click(screen.getByRole('button', { name: '3 out of 5 stars' }));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('disabled: all star buttons are disabled', () => {
		renderRating({ disabled: true });
		const stars = screen.getAllByRole('button');
		stars.forEach((star) => expect(star).toBeDisabled());
	});

	it('disabled: stars have data-disabled attribute', () => {
		renderRating({ disabled: true });
		const stars = screen.getAllByRole('button');
		stars.forEach((star) => expect(star).toHaveAttribute('data-disabled', ''));
	});

	it('readOnly: clicking does not fire onChange', async () => {
		const handleChange = vi.fn();
		renderRating({ readOnly: true, value: 3, onChange: handleChange });
		await userEvent.click(screen.getByRole('button', { name: '4 out of 5 stars' }));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('readOnly: root has role="img" with accessible label', () => {
		renderRating({ readOnly: true, value: 4, max: 5 });
		expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Rating: 4 out of 5');
	});

	it('interactive: root has role="group"', () => {
		renderRating();
		expect(screen.getByRole('group')).toBeInTheDocument();
	});
});
