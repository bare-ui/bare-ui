import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { TagInput } from '.';

const {
	Root: TagInputRoot,
	List: TagInputList,
	Items: TagInputItems,
	Field: TagInputField,
} = TagInput;

function renderTagInput(props: Record<string, unknown> = {}) {
	return render({
		components: { TagInputRoot, TagInputList, TagInputItems, TagInputField },
		setup() {
			return { props };
		},
		template: `
			<TagInputRoot v-bind="props">
				<TagInputList>
					<TagInputItems v-slot="{ tag, remove }">
						<span :data-testid="'tag-' + tag">
							{{ tag }}
							<button @click="remove" :aria-label="'remove ' + tag">×</button>
						</span>
					</TagInputItems>
				</TagInputList>
				<TagInputField aria-label="tags" placeholder="Add tag" />
			</TagInputRoot>
		`,
	});
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
		(input as HTMLInputElement).focus();
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
