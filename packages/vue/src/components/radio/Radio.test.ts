import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Radio } from '.';

function renderRadio(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Radio.Root, { ...rootProps }, () => [
					h(Radio.Item, { value: 'red' }, () => [
						h(Radio.Indicator, null, () => '●'),
						h(Radio.Label, null, () => 'Red'),
					]),
					h(Radio.Item, { value: 'blue' }, () => [
						h(Radio.Indicator, null, () => '●'),
						h(Radio.Label, null, () => 'Blue'),
					]),
				]);
		},
	});
}

describe('Radio', () => {
	it('renders items', () => {
		renderRadio();
		expect(screen.getByText('Red')).toBeInTheDocument();
		expect(screen.getByText('Blue')).toBeInTheDocument();
	});

	it('has role="radiogroup"', () => {
		renderRadio();
		expect(screen.getByRole('radiogroup')).toBeInTheDocument();
	});

	it('clicking selects item', async () => {
		renderRadio();
		const red = screen.getByText('Red').closest('div')!;
		await userEvent.click(red);
		expect(red).toHaveAttribute('data-checked', '');
	});

	it('selecting a new item deselects the previous', async () => {
		renderRadio();
		const red = screen.getByText('Red').closest('div')!;
		const blue = screen.getByText('Blue').closest('div')!;
		await userEvent.click(red);
		expect(red).toHaveAttribute('data-checked', '');
		await userEvent.click(blue);
		expect(red).not.toHaveAttribute('data-checked');
		expect(blue).toHaveAttribute('data-checked', '');
	});

	it('defaultValue pre-selects item', () => {
		renderRadio({ defaultValue: 'blue' });
		const blue = screen.getByText('Blue').closest('div')!;
		expect(blue).toHaveAttribute('data-checked', '');
	});

	it('onChange fires with selected value', async () => {
		const handleChange = vi.fn();
		renderRadio({ onChange: handleChange });
		await userEvent.click(screen.getByText('Red').closest('div')!);
		expect(handleChange).toHaveBeenCalledWith('red');
	});

	it('indicator shows only when selected', async () => {
		renderRadio();
		expect(screen.queryAllByText('●')).toHaveLength(0);
		await userEvent.click(screen.getByText('Red').closest('div')!);
		expect(screen.getByText('●')).toBeInTheDocument();
	});

	it('disabled item does not select', async () => {
		render({
			setup() {
				return () =>
					h(Radio.Root, {}, () => [
						h(Radio.Item, { value: 'red', disabled: true }, () => [
							h(Radio.Indicator, null, () => '●'),
							h(Radio.Label, null, () => 'Red'),
						]),
					]);
			},
		});
		await userEvent.click(screen.getByText('Red').closest('div')!);
		expect(screen.queryByText('●')).toBeNull();
	});
});
