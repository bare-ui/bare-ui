import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';
import { expectExposedAs } from '@/test/sr';

describe('Slider — screen reader semantics', () => {
	it('is exposed as a slider with consumer name, value range and orientation', () => {
		render(
			<Slider
				defaultValue={20}
				min={0}
				max={100}
				step={1}
				aria-label='Volume'
			/>,
		);
		const thumb = expectExposedAs('slider', 'Volume');
		expect(thumb).toHaveAttribute('aria-valuenow', '20');
		expect(thumb).toHaveAttribute('aria-valuemin', '0');
		expect(thumb).toHaveAttribute('aria-valuemax', '100');
		expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('exposes vertical orientation to assistive tech', () => {
		render(
			<Slider
				defaultValue={20}
				orientation='vertical'
				aria-label='Volume'
			/>,
		);
		expect(expectExposedAs('slider', 'Volume')).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('updates the announced value on arrow-key changes', async () => {
		render(
			<Slider
				defaultValue={50}
				min={0}
				max={100}
				step={5}
				aria-label='Volume'
			/>,
		);
		const thumb = expectExposedAs('slider', 'Volume');
		thumb.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '55');
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '45');
	});

	it('exposes a disabled slider to assistive tech', () => {
		render(
			<Slider
				defaultValue={20}
				disabled
				aria-label='Volume'
			/>,
		);
		expect(expectExposedAs('slider', 'Volume')).toHaveAttribute('aria-disabled', 'true');
	});

	it('range mode: each thumb is a distinctly named slider with its own value', () => {
		render(
			<Slider
				range
				defaultValue={[20, 80]}
				min={0}
				max={100}
				step={1}
				aria-label='Price'
			/>,
		);
		const min = expectExposedAs('slider', 'Minimum Price');
		const max = expectExposedAs('slider', 'Maximum Price');
		expect(min).toHaveAttribute('aria-valuenow', '20');
		expect(max).toHaveAttribute('aria-valuenow', '80');
	});

	it('range mode: the group carries the overall name', () => {
		render(
			<Slider
				range
				defaultValue={[20, 80]}
				aria-label='Price'
			/>,
		);
		expect(expectExposedAs('group', 'Price')).toBeInTheDocument();
	});

	it('range mode: moving the focused thumb updates only its announced value', async () => {
		render(
			<Slider
				range
				defaultValue={[20, 80]}
				min={0}
				max={100}
				step={5}
				aria-label='Price'
			/>,
		);
		const min = expectExposedAs('slider', 'Minimum Price');
		const max = expectExposedAs('slider', 'Maximum Price');
		min.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(min).toHaveAttribute('aria-valuenow', '25');
		expect(max).toHaveAttribute('aria-valuenow', '80');
	});
});
