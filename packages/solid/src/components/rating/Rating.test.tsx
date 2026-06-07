import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Rating } from './Rating';

function renderRating(props: ComponentProps<typeof Rating> = {}) {
	return render(() => <Rating {...props} />);
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

	// -------------------------------------------------------------------------
	// Roving tabindex + keyboard
	// -------------------------------------------------------------------------

	it('roving tabindex: exactly one star is tabbable (first when nothing selected)', () => {
		renderRating();
		const stars = screen.getAllByRole('button');
		const tabbable = stars.filter((s) => s.tabIndex === 0);
		expect(tabbable).toHaveLength(1);
		expect(stars[0].tabIndex).toBe(0);
	});

	it('roving tabindex: the selected star is the tabbable one', () => {
		renderRating({ defaultValue: 3 });
		const stars = screen.getAllByRole('button');
		expect(stars.filter((s) => s.tabIndex === 0)).toHaveLength(1);
		expect(stars[2].tabIndex).toBe(0); // star 3
	});

	it('ArrowRight increases the rating by 1 and moves focus', async () => {
		renderRating({ defaultValue: 2 });
		const stars = screen.getAllByRole('button');
		stars[1].focus();
		await userEvent.keyboard('{ArrowRight}');
		const after = screen.getAllByRole('button');
		expect(after[2]).toHaveAttribute('data-filled', ''); // star 3 now filled
		expect(document.activeElement).toBe(after[2]);
		expect(after[2].tabIndex).toBe(0);
	});

	it('ArrowUp increases, ArrowDown/ArrowLeft decrease', async () => {
		renderRating({ defaultValue: 3 });
		const stars = screen.getAllByRole('button');
		stars[2].focus();
		await userEvent.keyboard('{ArrowUp}');
		expect(screen.getAllByRole('button')[3]).toHaveAttribute('data-filled', ''); // star 4
		screen.getAllByRole('button')[3].focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getAllByRole('button')[2]).toHaveAttribute('data-filled', ''); // back to 3
		expect(screen.getAllByRole('button')[3]).not.toHaveAttribute('data-filled');
		screen.getAllByRole('button')[2].focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getAllByRole('button')[1]).toHaveAttribute('data-filled', ''); // star 2
		expect(screen.getAllByRole('button')[2]).not.toHaveAttribute('data-filled');
	});

	it('arrows clamp at the min (1) and max', async () => {
		renderRating({ defaultValue: 1 });
		screen.getAllByRole('button')[0].focus();
		await userEvent.keyboard('{ArrowLeft}');
		// Stays at 1 (cannot go below 1).
		expect(screen.getAllByRole('button')[0]).toHaveAttribute('data-filled', '');
		// Home → 1, End → max.
		await userEvent.keyboard('{End}');
		const stars = screen.getAllByRole('button');
		stars.forEach((s) => expect(s).toHaveAttribute('data-filled', ''));
	});

	it('Home jumps to 1, End jumps to max', async () => {
		renderRating({ defaultValue: 3, max: 5 });
		screen.getAllByRole('button')[2].focus();
		await userEvent.keyboard('{End}');
		expect(screen.getAllByRole('button')[4]).toHaveAttribute('data-filled', '');
		expect(document.activeElement).toBe(screen.getAllByRole('button')[4]);
		await userEvent.keyboard('{Home}');
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('data-filled', '');
		expect(stars[1]).not.toHaveAttribute('data-filled');
		expect(document.activeElement).toBe(stars[0]);
	});

	it('aria-pressed reflects whether each star is at or below the value', () => {
		renderRating({ defaultValue: 3, max: 5 });
		const stars = screen.getAllByRole('button');
		expect(stars[0]).toHaveAttribute('aria-pressed', 'true');
		expect(stars[2]).toHaveAttribute('aria-pressed', 'true');
		expect(stars[3]).toHaveAttribute('aria-pressed', 'false');
	});

	it('readOnly: stars are not pressed-toggles and not in tab order', () => {
		renderRating({ readOnly: true, value: 3, max: 5 });
		const stars = screen.getAllByRole('button');
		stars.forEach((s) => {
			expect(s).not.toHaveAttribute('aria-pressed');
			expect(s.tabIndex).toBe(-1);
		});
	});

	it('keyboard does nothing when disabled', async () => {
		const onChange = vi.fn();
		renderRating({ disabled: true, defaultValue: 2, onChange });
		const stars = screen.getAllByRole('button');
		stars[1].focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).not.toHaveBeenCalled();
	});
});
