import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Checkbox } from '.';

function renderCheckbox(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Checkbox.Root, { ...rootProps }, () => [
					h(Checkbox.Item, { value: 'apple' }, () => [
						h(Checkbox.Indicator, null, () => '✓'),
						h(Checkbox.Label, null, () => 'Apple'),
					]),
					h(Checkbox.Item, { value: 'banana' }, () => [
						h(Checkbox.Indicator, null, () => '✓'),
						h(Checkbox.Label, null, () => 'Banana'),
					]),
				]);
		},
	});
}

describe('Checkbox', () => {
	it('renders items', () => {
		renderCheckbox();
		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('clicking toggles data-checked', async () => {
		renderCheckbox();
		const apple = screen.getByText('Apple').closest('div')!;
		expect(apple).not.toHaveAttribute('data-checked');
		await userEvent.click(apple);
		expect(apple).toHaveAttribute('data-checked', '');
	});

	it('defaultValue pre-selects items', () => {
		renderCheckbox({ defaultValue: ['banana'] });
		const banana = screen.getByText('Banana').closest('[data-checked]');
		expect(banana).toBeInTheDocument();
	});

	it('onChange fires with updated values', async () => {
		const handleChange = vi.fn();
		renderCheckbox({ onChange: handleChange });
		await userEvent.click(screen.getByText('Apple').closest('div')!);
		expect(handleChange).toHaveBeenCalledWith(['apple']);
	});

	it('indicator shows only when checked', async () => {
		renderCheckbox();
		expect(screen.queryAllByText('✓')).toHaveLength(0);
		await userEvent.click(screen.getByText('Apple').closest('div')!);
		expect(screen.getByText('✓')).toBeInTheDocument();
	});

	it('disabled item does not toggle', async () => {
		render({
			setup() {
				return () =>
					h(Checkbox.Root, {}, () => [
						h(Checkbox.Item, { value: 'apple', disabled: true }, () => [
							h(Checkbox.Indicator, null, () => '✓'),
							h(Checkbox.Label, null, () => 'Apple'),
						]),
					]);
			},
		});
		await userEvent.click(screen.getByText('Apple').closest('div')!);
		expect(screen.queryByText('✓')).toBeNull();
	});

	it('multiple selections work', async () => {
		renderCheckbox();
		await userEvent.click(screen.getByText('Apple').closest('div')!);
		await userEvent.click(screen.getByText('Banana').closest('div')!);
		expect(screen.getAllByText('✓')).toHaveLength(2);
	});
});
