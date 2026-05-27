import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Slider } from '.';

describe('Slider (single)', () => {
	it('renders a slider thumb with role and aria attributes', () => {
		render({ setup: () => () => h(Slider, { defaultValue: 20, min: 0, max: 100, step: 1, 'aria-label': 'volume' }) });
		const thumb = screen.getByRole('slider');
		expect(thumb).toHaveAttribute('aria-valuemin', '0');
		expect(thumb).toHaveAttribute('aria-valuemax', '100');
		expect(thumb).toHaveAttribute('aria-valuenow', '20');
	});

	it('arrow keys change value by step', async () => {
		render({ setup: () => () => h(Slider, { defaultValue: 50, min: 0, max: 100, step: 5 }) });
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '55');
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '45');
	});

	it('Home/End jump to min/max; PageUp/PageDown move 10x step', async () => {
		render({ setup: () => () => h(Slider, { defaultValue: 50, min: 0, max: 100, step: 2 }) });
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{Home}');
		expect(thumb).toHaveAttribute('aria-valuenow', '0');
		await userEvent.keyboard('{End}');
		expect(thumb).toHaveAttribute('aria-valuenow', '100');
		await userEvent.keyboard('{PageDown}');
		expect(thumb).toHaveAttribute('aria-valuenow', '80');
		await userEvent.keyboard('{PageUp}');
		expect(thumb).toHaveAttribute('aria-valuenow', '100');
	});

	it('clamps to min/max', async () => {
		render({ setup: () => () => h(Slider, { defaultValue: 5, min: 0, max: 10, step: 1 }) });
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '0');
	});

	it('controlled: onChange fires but value sticks until parent updates', async () => {
		const onChange = vi.fn();
		render({ setup: () => () => h(Slider, { value: 10, min: 0, max: 100, step: 1, onChange }) });
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenCalledWith(11);
		expect(thumb).toHaveAttribute('aria-valuenow', '10');
	});

	it('disabled: keyboard does nothing', async () => {
		const onChange = vi.fn();
		render({ setup: () => () => h(Slider, { defaultValue: 5, disabled: true, onChange }) });
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('forwards class to the root element', () => {
		render({ setup: () => () => h(Slider, { defaultValue: 5, class: 'sl', 'data-testid': 'root' }) });
		expect(screen.getByTestId('root')).toHaveClass('sl');
	});
});

describe('Slider (range)', () => {
	it('renders two thumbs', () => {
		render({ setup: () => () => h(Slider, { range: true, defaultValue: [20, 80], min: 0, max: 100, step: 1 }) });
		const thumbs = screen.getAllByRole('slider');
		expect(thumbs).toHaveLength(2);
		expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
	});

	it('keyboard moves the focused thumb only', async () => {
		const onChange = vi.fn();
		render({ setup: () => () => h(Slider, { range: true, defaultValue: [20, 80], min: 0, max: 100, step: 5, onChange }) });
		const thumbs = screen.getAllByRole('slider');
		thumbs[0].focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(thumbs[0]).toHaveAttribute('aria-valuenow', '25');
		expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
		expect(onChange).toHaveBeenLastCalledWith([25, 80]);
	});

	it('thumbs cannot cross — order is normalized', async () => {
		render({ setup: () => () => h(Slider, { range: true, defaultValue: [20, 30], min: 0, max: 100, step: 5 }) });
		const thumbs = screen.getAllByRole('slider');
		thumbs[0].focus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
		const after = screen.getAllByRole('slider');
		const v0 = Number(after[0].getAttribute('aria-valuenow'));
		const v1 = Number(after[1].getAttribute('aria-valuenow'));
		expect(v0).toBeLessThanOrEqual(v1);
	});
});
