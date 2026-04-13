import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, ref } from 'vue';
import { Select } from '.';

function renderSelect(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Select.Root, { ...rootProps }, () => [
					h(Select.Trigger, null, () => [
						h(Select.Value, { placeholder: 'Pick one' }),
					]),
					h(Select.Content, null, () => [
						h(Select.Item, { value: 'apple', textValue: 'Apple' }, () => 'Apple'),
						h(Select.Item, { value: 'banana', textValue: 'Banana' }, () => 'Banana'),
						h(Select.Item, { value: 'cherry', textValue: 'Cherry' }, () => 'Cherry'),
					]),
				]);
		},
	});
}

describe('Select', () => {
	it('shows placeholder when nothing is selected', () => {
		renderSelect();
		expect(screen.getByText('Pick one')).toBeInTheDocument();
	});

	it('opens dropdown on trigger click', async () => {
		renderSelect();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('selects an item on click', async () => {
		renderSelect();
		await userEvent.click(screen.getByRole('button'));
		await userEvent.click(screen.getByText('Banana'));
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('renders defaultValue after opening', async () => {
		renderSelect({ defaultValue: 'cherry' });
		// Open to let items register, then close
		await userEvent.click(screen.getByRole('button'));
		await userEvent.keyboard('{Escape}');
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});

	it('controlled value reflects external state after opening', async () => {
		render({
			setup() {
				return () =>
					h(Select.Root, { value: 'apple' }, () => [
						h(Select.Trigger, null, () => [
							h(Select.Value, { placeholder: 'Pick one' }),
						]),
						h(Select.Content, null, () => [
							h(Select.Item, { value: 'apple', textValue: 'Apple' }, () => 'Apple'),
							h(Select.Item, { value: 'banana', textValue: 'Banana' }, () => 'Banana'),
						]),
					]);
			},
		});
		// Open to let items register, then close
		await userEvent.click(screen.getByRole('button'));
		await userEvent.keyboard('{Escape}');
		// Value component should show the selected label
		expect(screen.getByText('Apple')).toBeInTheDocument();
	});

	it('calls onChange on selection', async () => {
		const handleChange = vi.fn();
		renderSelect({ onChange: handleChange });
		await userEvent.click(screen.getByRole('button'));
		await userEvent.click(screen.getByText('Apple'));
		expect(handleChange).toHaveBeenCalledWith('apple');
	});

	it('Escape closes the dropdown', async () => {
		renderSelect();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).toBeNull();
	});
});
