/**
 * Screen-reader semantics for TagInput. The committed tags are rendered by the
 * consumer through a render-prop, so these tests model the idiomatic accessible
 * markup (a list of listitems, each with a per-tag "Remove …" button) and verify
 * that adding and removing tags changes what the SR can navigate: the field is
 * reachable by its accessible NAME, each tag's remove control is individually
 * named, and the listitem set grows / shrinks as tags are added and removed.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { TagInput } from './TagInput';
import { expectExposedAs } from '@/test/sr';

function renderTagInput(props: Partial<ComponentProps<typeof TagInput.Root>> = {}) {
	return render(() => (
		<TagInput.Root {...props}>
			<TagInput.List
				role='list'
				aria-label='Selected tags'>
				<TagInput.Items>
					{(tag, _i, remove) => (
						<span role='listitem'>
							{tag}
							<button
								onClick={remove}
								aria-label={`Remove ${tag}`}>
								×
							</button>
						</span>
					)}
				</TagInput.Items>
			</TagInput.List>
			<TagInput.Field aria-label='Add a tag' />
		</TagInput.Root>
	));
}

describe('TagInput — screen reader semantics', () => {
	it('names the entry field from its consumer-supplied label', () => {
		renderTagInput();
		expectExposedAs('textbox', 'Add a tag');
	});

	it('exposes each committed tag as a listitem the SR can navigate', () => {
		renderTagInput({ defaultValue: ['react', 'vue'] });
		const list = expectExposedAs('list', 'Selected tags');
		const items = within(list).getAllByRole('listitem');
		expect(items).toHaveLength(2);
		expect(items[0]).toHaveTextContent('react');
		expect(items[1]).toHaveTextContent('vue');
	});

	it('gives every tag an individually named remove control', () => {
		renderTagInput({ defaultValue: ['react', 'vue'] });
		expectExposedAs('button', 'Remove react');
		expectExposedAs('button', 'Remove vue');
	});

	it('adds a navigable listitem when a tag is committed', async () => {
		renderTagInput();
		await userEvent.type(screen.getByRole('textbox', { name: 'Add a tag' }), 'svelte{Enter}');
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expectExposedAs('button', 'Remove svelte');
	});

	it('drops the tag and its remove control from the tree when removed', async () => {
		renderTagInput({ defaultValue: ['react', 'vue'] });
		await userEvent.click(screen.getByRole('button', { name: 'Remove react' }));
		expect(screen.queryByRole('button', { name: 'Remove react' })).toBeNull();
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expectExposedAs('button', 'Remove vue');
	});

	it('exposes the field as disabled when the max-tags limit is reached', () => {
		renderTagInput({ maxTags: 2, defaultValue: ['a', 'b'] });
		expect(screen.getByRole('textbox', { name: 'Add a tag' })).toBeDisabled();
	});
});
