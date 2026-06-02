import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

function renderTagInput(props: Partial<React.ComponentProps<typeof TagInput.Root>> = {}) {
	return render(
		<TagInput.Root {...props}>
			<TagInput.List>
				<TagInput.Items>
					{(tag, i, remove) => (
						<span key={i} data-testid={`tag-${tag}`}>
							{tag}
							<button onClick={remove} aria-label={`remove ${tag}`}>×</button>
						</span>
					)}
				</TagInput.Items>
			</TagInput.List>
			<TagInput.Field aria-label='tags' placeholder='Add tag' />
		</TagInput.Root>,
	);
}

describe('TagInput', () => {
	it('adds a tag on Enter', async () => {
		const onChange = vi.fn();
		renderTagInput({ onChange });
		const input = screen.getByLabelText('tags');
		await userEvent.type(input, 'react{Enter}');
		expect(onChange).toHaveBeenLastCalledWith(['react']);
		expect(screen.getByTestId('tag-react')).toBeInTheDocument();
		expect(input).toHaveValue('');
	});

	it('adds a tag on comma key', async () => {
		const onChange = vi.fn();
		renderTagInput({ onChange });
		const input = screen.getByLabelText('tags');
		await userEvent.type(input, 'vue,');
		expect(onChange).toHaveBeenLastCalledWith(['vue']);
	});

	it('Backspace at empty input removes the last tag', async () => {
		renderTagInput({ defaultValue: ['a', 'b'] });
		const input = screen.getByLabelText('tags');
		input.focus();
		await userEvent.keyboard('{Backspace}');
		expect(screen.queryByTestId('tag-b')).not.toBeInTheDocument();
		expect(screen.getByTestId('tag-a')).toBeInTheDocument();
	});

	it('rejects duplicates by default', async () => {
		renderTagInput({ defaultValue: ['react'] });
		const input = screen.getByLabelText('tags');
		await userEvent.type(input, 'react{Enter}');
		expect(screen.getAllByText('react')).toHaveLength(1);
	});

	it('respects maxTags', async () => {
		renderTagInput({ maxTags: 2, defaultValue: ['a', 'b'] });
		const input = screen.getByLabelText('tags') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('Remove button removes a specific tag', async () => {
		renderTagInput({ defaultValue: ['a', 'b', 'c'] });
		await userEvent.click(screen.getByLabelText('remove b'));
		expect(screen.queryByTestId('tag-b')).not.toBeInTheDocument();
	});

	describe('Tag convenience component', () => {
		function renderWithTag(defaultValue = ['react', 'vue', 'solid']) {
			return render(
				<TagInput.Root defaultValue={defaultValue}>
					<TagInput.List>
						<TagInput.Items>
							{(tag, _i, remove) => (
								<TagInput.Tag
									key={tag}
									label={tag}
									onRemove={remove}>
									{tag}
								</TagInput.Tag>
							)}
						</TagInput.Items>
					</TagInput.List>
					<TagInput.Field aria-label='tags' />
				</TagInput.Root>,
			);
		}

		it('renders a focusable remove button with an accessible name', () => {
			renderWithTag();
			const removeVue = screen.getByRole('button', { name: 'Remove vue' });
			expect(removeVue).toBeInTheDocument();
		});

		it('removes the tag when its remove button is activated by keyboard', async () => {
			renderWithTag();
			const removeVue = screen.getByRole('button', { name: 'Remove vue' });
			removeVue.focus();
			await userEvent.keyboard('{Enter}');
			expect(screen.queryByRole('button', { name: 'Remove vue' })).not.toBeInTheDocument();
		});

		it('keeps focus on an adjacent remove button after removing', async () => {
			renderWithTag();
			await userEvent.click(screen.getByRole('button', { name: 'Remove vue' }));
			// Focus moves to the next tag's remove button (solid), not <body>.
			expect(screen.getByRole('button', { name: 'Remove solid' })).toHaveFocus();
		});
	});
});
