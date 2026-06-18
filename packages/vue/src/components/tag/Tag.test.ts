import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Tag } from '.';

describe('Tag', () => {
	it('renders label and remove button', () => {
		render({
			setup: () => () =>
				h(Tag.Root, null, () => [
					h(Tag.Label, null, () => 'React'),
					h(Tag.Remove),
				]),
		});
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
	});

	it('Remove button fires onClick', async () => {
		const onClick = vi.fn();
		render({
			setup: () => () =>
				h(Tag.Root, null, () => [
					h(Tag.Label, null, () => 'Vue'),
					h(Tag.Remove, { onClick }),
				]),
		});
		await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
		expect(onClick).toHaveBeenCalled();
	});

	it('disabled root sets data-disabled', () => {
		render({
			setup: () => () =>
				h(Tag.Root, { disabled: true, 'data-testid': 'tag' }, () => [
					h(Tag.Label, null, () => 'Svelte'),
				]),
		});
		expect(screen.getByTestId('tag')).toHaveAttribute('data-disabled', '');
	});
});
