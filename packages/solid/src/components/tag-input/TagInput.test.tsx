import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { TagInput } from './TagInput';

function renderTagInput(props: Partial<ComponentProps<typeof TagInput.Root>> = {}) {
	return render(() => (
		<TagInput.Root {...props}>
			<TagInput.List>
				<TagInput.Items>
					{(tag, _i, remove) => (
						<span data-testid={`tag-${tag}`}>
							{tag}
							<button
								onClick={remove}
								aria-label={`remove ${tag}`}>
								×
							</button>
						</span>
					)}
				</TagInput.Items>
			</TagInput.List>
			<TagInput.Field
				aria-label='tags'
				placeholder='Add tag'
			/>
		</TagInput.Root>
	));
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

	it('respects maxTags', () => {
		renderTagInput({ maxTags: 2, defaultValue: ['a', 'b'] });
		const input = screen.getByLabelText('tags') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('Remove button removes a specific tag', async () => {
		renderTagInput({ defaultValue: ['a', 'b', 'c'] });
		await userEvent.click(screen.getByLabelText('remove b'));
		expect(screen.queryByTestId('tag-b')).not.toBeInTheDocument();
	});
});
