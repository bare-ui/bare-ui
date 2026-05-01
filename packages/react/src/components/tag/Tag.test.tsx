import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
	it('renders label and remove button', () => {
		render(
			<Tag.Root>
				<Tag.Label>React</Tag.Label>
				<Tag.Remove />
			</Tag.Root>,
		);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
	});

	it('Remove button fires onClick', async () => {
		const onClick = vi.fn();
		render(
			<Tag.Root>
				<Tag.Label>Vue</Tag.Label>
				<Tag.Remove onClick={onClick} />
			</Tag.Root>,
		);
		await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
		expect(onClick).toHaveBeenCalled();
	});

	it('disabled root sets data-disabled', () => {
		render(
			<Tag.Root disabled data-testid='tag'>
				<Tag.Label>Svelte</Tag.Label>
			</Tag.Root>,
		);
		expect(screen.getByTestId('tag')).toHaveAttribute('data-disabled', '');
	});
});
